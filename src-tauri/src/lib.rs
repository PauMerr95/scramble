#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
    .invoke_handler(tauri::generate_handler![get_dna])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

use tauri::ipc::Response;

#[tauri::command]
fn get_dna(path: String) -> Response {
  let data = std::fs::read(path).unwrap();
  tauri::ipc::Response::new(data)
}
