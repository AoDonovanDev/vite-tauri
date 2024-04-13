// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_user])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn get_user() -> String{
  let resp = reqwest::get("https://randomuser.me/api/")
    .await
    .unwrap()
    .text()
    .await
    .unwrap();
  resp
}