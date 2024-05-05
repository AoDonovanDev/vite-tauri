// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::ser::{Serialize, SerializeStruct, Serializer};

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_user, get_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_user() -> String {
    let resp = reqwest::get("https://randomuser.me/api/")
        .await
        .unwrap()
        .text()
        .await
        .unwrap();
    resp
}

struct ResponseObject {
    resp_string: String,
    resp_type: String,
}

impl Serialize for ResponseObject {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("ResponseObject", 2)?;
        state.serialize_field("resp_string", &self.resp_string)?;
        state.serialize_field("resp_type", &self.resp_type)?;
        state.end()
    }
}

#[tauri::command]
async fn get_text(url: String) -> Result<ResponseObject, String> {
    let response = match reqwest::Url::parse(&url) {
        Ok(endpoint) => match reqwest::get(endpoint).await {
            Ok(res) => {
                let headers = reqwest::Response::headers(&res);
                let content_type = headers
                    .get("content-type")
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string();
                println!("{:?}", content_type);
                match res.text().await {
                    Ok(txt) => ResponseObject {
                        resp_string: txt,
                        resp_type: content_type,
                    },
                    Err(_err) => ResponseObject {
                        resp_string: "{\"Error\": \"Couldnt resolve text from response\"}"
                            .to_string(),
                        resp_type: "json".to_string(),
                    },
                }
            }
            Err(err) => ResponseObject {
                resp_string: err.to_string(),
                resp_type: "json".to_string(),
            },
        },
        Err(_err) => ResponseObject {
            resp_string: "{\"Error\": \"Couldnt resolve host name\"}".to_string(),
            resp_type: "json".to_string(),
        },
    };
    Ok(response)
}
