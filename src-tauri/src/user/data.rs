use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

use std::fs;
use std::path;
use std::sync::Mutex;

pub enum OS {
    Linux,
    Windows,
    Mac
}
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub enum Theme {
    #[default]
    DarkLime,
    DeepOcean
}
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub enum Avatar {
    Bird,
    Duck,
    Earth,
    Falling,
    #[default]
    Sheep,
    Squirrel
}

pub struct UserState {
    pub data: Mutex<UserInfo>,
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct UserInfo {
    pub id: u32,
    pub name: String,
    pub avatar: Avatar,
    pub theme: Theme,
    pub api_key: String,
    pub last_session_path: Option<String>,
    #[serde(with = "chrono::serde::ts_seconds")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "chrono::serde::ts_seconds")]
    pub updated_at: DateTime<Utc>,
}

impl UserInfo {
    pub fn new() -> UserInfo {
        let name= String::from("Test User");
        let avatar = Avatar::Sheep;
        let theme = Theme::DarkLime;
        let api_key  = get_api_key_env().unwrap_or("".to_string());
        let last_session_path = None;
        let timestamp = Utc::now();
        Self {id: 0, name, avatar, theme, api_key, last_session_path, created_at: timestamp, updated_at: timestamp}
    }
    pub async fn from(path: &str) -> Result<UserInfo, String> {
        toml::from_str(path).unwrap()
    }
}

#[derive(Serialize, Deserialize, Default)]
pub struct ScrambleConfig {
    pub config_path: path::PathBuf,
    pub nucl_db_path: path::PathBuf,
    // add config
}


fn get_api_key_env() -> Result<String, String> {
    if let Ok(key) = std::env::var("NCBI_API_KEY") {
        Ok(key)
    } else {
        Err("Could not retrieve NCBI_API_KEY from environment".to_string())
    }
}

pub fn default_config_path(os: OS) -> Result<path::PathBuf, String> {
    match os {
        OS::Linux   => if let Ok(path) = std::env::var("HOME") {
                Ok(path::PathBuf::from(format!("{path}/.config/scramble/.config.toml")))
            } else {
                Err("Could not resolve HOME path for Linux".to_string())
            }
        OS::Mac     => if let Ok(path) = std::env::var("HOME") {
                Ok(path::PathBuf::from(format!("{path}/Library/Application Support/Scramble/.config.toml")))
            } else {
                Err("Could not resolve HOME path for MacOS".to_string())
            }
        OS::Windows => if let Ok(path) = std::env::var("LOCALAPPDATA") {
            Ok(path::PathBuf::from(format!("{path}\\Scramble\\.config.toml")))
        } else if let Ok(path) = std::env::var("HOMEPATH") {
            Ok(path::PathBuf::from(format!("{path}\\AppData\\Local\\Scramble\\.config.toml")))
        } else {
            Err("Could not resolve Appdata Directory for Windows".to_string())
        }
    }
}

pub fn retrieve_os() -> OS {
    match std::env::consts::OS {
        "linux"     => OS::Linux,
        "windows"   => OS::Windows,
        "macos"     => OS::Mac,
        _ => panic!("Unsupported system detected. Only supporting Linux, Windows and MacOS")
    }
}

pub fn load_config(config_path: path::PathBuf) -> UserInfo {
    if config_path.exists() {
        let raw = fs::read_to_string(config_path)
        .expect("Failed to read config");
        toml::from_str(&raw).unwrap_or_default()
    } else {
        UserInfo::new()
    }
}

pub fn save_config(user_data: UserInfo, config_path: &str) -> Result<(), String>{
    let raw = toml::to_string(&user_data).expect("Failed to serialize ScrambleConfig");
    if let Some(parent) = path::Path::new(&config_path).parent() {
        let _ = fs::create_dir(parent)
            .map_err(|e| format!("Failed to create config directory: {}", e));
    }
    fs::write(config_path, raw)
        .map_err(|e| format!("Failed to write serialize UserData to file: {}", e))
}