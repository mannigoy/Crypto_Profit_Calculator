// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn fetch_php_rate() -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://api.frankfurter.app/latest?from=USD&to=PHP")
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    let data: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Parse failed: {}", e))?;
    
    let rate = data["rates"]["PHP"]
        .as_f64()
        .ok_or("Invalid response format".to_string())?;
    
    Ok(rate.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, fetch_php_rate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
