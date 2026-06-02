use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

use std::env;
use std::fs;
use std::path;
use std::sync::Mutex;

use crate::user::db;

pub enum OS {
    Linux,
    Windows,
    Mac
}

pub struct UserState {
    pub data: Mutex<UserInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: u32,
    pub name: String,
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
        let api_key  = retrieve_api_key().unwrap_or("".to_string());
        let last_session_path = None;
        let timestamp = Utc::now();
        Self {id: 0, name, api_key, last_session_path, created_at: timestamp, updated_at: timestamp}
    }
    pub async fn from(config: &ScrambleConfig) -> UserInfo {
        // open db connection and get data:
        match db::get_user_data(config.user_db_path.as_path()).await {
            Ok(result) => result,
            Err(error) => {
                print!("Could not retrieve user information from database: {error}");
                UserInfo::new()
            }
        }
    }
}

#[derive(Serialize, Deserialize, Default)]
pub struct ScrambleConfig {
    pub scramble_dir: path::PathBuf,
    pub user_db_path: path::PathBuf,
    pub nucl_db_path: path::PathBuf,
    // add config
}

pub fn retrieve_user_name() -> Result<String, String>{
    Ok("Toni Maroni".to_string())
}

fn retrieve_user_home() -> Result<path::PathBuf, ()> {
    if let Ok(path_str) = env::var("SCRAMBLE_DIR") {
        let mut path = path::PathBuf::with_capacity(path_str.len());
        path.push(path_str);
        Ok(path)
    } else {
      default_home_path(retrieve_os())
    }
}

fn retrieve_api_key() -> Result<String, String> {
    if let Ok(key) = env::var("NCBI_API_KEY") {
        Ok(key)
    } else {
        Err(String::from("No existing API_KEY in environment found"))
    }
}

pub fn default_home_path(os: OS) -> Result<path::PathBuf, ()>{
    match os {
        OS::Linux   => set_home_from(
            if let Ok(path) = std::env::var("HOME") {
                format!("{}/.local/share/Scramble/", path)
            } else {
                panic!("Could not resolve $HOME directory for Linux");
            }
        ),
        OS::Windows => set_home_from(
            if let Ok(path) = std::env::var("LOCALAPPDATA") {
                format!("{}\\Scramble", path)
            } else if let Ok(home_path) = std::env::var("HOMEPATH") {
                    format!("{}\\AppData\\Local\\Scramble", home_path)
            } else {
                panic!("Could not resolve AppData directory for Windows");
            }
        ),
        OS::Mac     => set_home_from(
            if let Ok(path) = std::env::var("HOME") {
                format!("{}/Library/Application Support/Scramble", path)
            } else {
                panic!("Could not resolve $HOME directory for Linux");
            }
        )
    }
}

pub fn set_default_config_path(os: OS) -> Result<path::PathBuf, ()> {
    match os {
        OS::Linux   => set_config_from(
            if let Ok(path) = std::env::var("HOME") {
                format!("{}/.config/Scramble/.config.toml", path)
            } else {
                panic!("Could not resolve $HOME directory for Linux");
            }
        ),
        OS::Windows => set_config_from(
            if let Ok(path) = std::env::var("LOCALAPPDATA") {
                format!("{}\\Scramble", path)
            } else if let Ok(home_path) = std::env::var("HOMEPATH") {
                    format!("{}\\AppData\\Local\\Scramble\\.config.toml", home_path)
            } else {
                panic!("Could not resolve AppData directory for Windows");
            }
        ),
        OS::Mac     => set_config_from(
            if let Ok(path) = std::env::var("HOME") {
                format!("{}/Library/Application Support/Scramble/.config.toml", path)
            } else {
                panic!("Could not resolve $HOME directory for Linux");
            }
        )
    }
}


pub fn set_config_from(new_path: String) -> Result<path::PathBuf, ()>{
    unsafe {
        env::set_var("SCRAMBLE_CONFIG", &new_path);
    }
    assert_eq!(env::var("SCRAMBLE_CONFIG").unwrap(), new_path);
    let mut config_path: path::PathBuf = path::PathBuf::with_capacity(new_path.len());
    config_path.push(&new_path);
    Ok(config_path)
}
fn set_home_from(new_path: String) -> Result<path::PathBuf, ()>{
  unsafe {
    env::set_var("SCRAMBLE_DIR", &new_path);
  }
  assert_eq!(env::var("SCRAMBLE_DIR").unwrap(), new_path);
  let mut home_path = path::PathBuf::with_capacity(new_path.len());
  home_path.push(&new_path);
  Ok(home_path)
}

pub fn retrieve_os() -> OS {
    match std::env::consts::OS {
        "linux"     => OS::Linux,
        "windows"   => OS::Windows,
        "macos"     => OS::Mac,
        _ => panic!("Unsupported system detected. Only supporting Linux, Windows and MacOS")
    }
}

pub fn load_config(config_path: &path::Path) -> ScrambleConfig {
    if config_path.exists() {
        let raw = fs::read_to_string(config_path)
        .expect("Failed to read config");
        toml::from_str(&raw).unwrap_or_default()
    } else {
        ScrambleConfig::default()
    }
}

pub fn save_config(config: &ScrambleConfig) {
    let config_path = &config.scramble_dir;
    let raw = toml::to_string(config).expect("Failed to serialize ScrambleConfig");
    fs::write(config_path, raw).expect("Failed to write raw config to file")
}