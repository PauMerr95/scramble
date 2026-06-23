use crate::user::data::{self, OS, default_config_path };
use std::sync::Mutex;
use chrono::Utc;

pub mod user;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(user: data::UserInfo) {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .manage(data::UserState { data: Mutex::new(user)})
    .invoke_handler(tauri::generate_handler![
        get_user_info,
        get_config_path,
        save_user_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get_user_info(user_state: tauri::State<data::UserState>) -> data::UserInfo {
  let user = user_state.data.lock().unwrap().clone();
  user
}

#[tauri::command]
fn get_config_path() -> String {
  let os: OS = user::data::retrieve_os();
  default_config_path(os).unwrap().to_string_lossy().into_owned()
}

#[tauri::command]
fn save_user_info(user_state: tauri::State<data::UserState>, mut user_data: data::UserInfo, config_path: String) -> Result<data::UserInfo, String> {
  user_data.updated_at = Utc::now();
  let mut user_backend = user_state.data.lock().unwrap();
  *user_backend = user_data.clone();
  user::data::save_to_file(&user_data, &config_path)?;
  Ok(user_data)
}