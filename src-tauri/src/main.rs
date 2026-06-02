// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app_lib::user::data;


#[tokio::main]
async fn main() {
  let _config = data::load_config(
    data::set_default_config_path(data::retrieve_os())
    .unwrap().as_path()
  );

 // let user= data::UserInfo::from(&config).await;
 let user = data::UserInfo::new();

  app_lib::run(user);
}
