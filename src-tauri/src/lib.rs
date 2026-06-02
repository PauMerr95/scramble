use crate::user::data;
use std::sync::Mutex;
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
    .invoke_handler(tauri::generate_handler![get_user_name, get_api_key])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get_user_name(user_state: tauri::State<data::UserState>) -> String {
  user_state.data.lock().unwrap().name.clone()
}

#[tauri::command]
fn get_api_key(user_state: tauri::State<data::UserState>) -> String {
  user_state.data.lock().unwrap().api_key.clone()
}

/*
  #[tauri::command]
  fn save_user_data(_name: String) -> () {
    todo!();
    // update or add username to db
  }

  #[tauri::command]
  fn save_api_key(_key: String) -> () {
    todo!();
    // update or add API_KEY to env
  }
*/