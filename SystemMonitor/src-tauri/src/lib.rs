use sysinfo::{System, SystemExt, DiskExt, CpuExt};
use serde::Serialize;

#[derive(Serialize)]
struct SystemStats {
    cpu_usage: f32,
    total_ram: f64,
    used_ram: f64,
    total_swap: f64,
    disk_total: f64,
    disk_used: f64,
}

#[tauri::command]
fn get_system_stats() -> SystemStats {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpu_usage = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;

    let total_ram = sys.total_memory() as f64 / 1024.0 / 1024.0;
    let used_ram = sys.used_memory() as f64 / 1024.0 / 1024.0;
    let total_swap = sys.total_swap() as f64 / 1024.0 / 1024.0;

    let mut disk_total: f64 = 0.0;
    let mut disk_used: f64 = 0.0;
    
    for disk in sys.disks() {
        disk_total += disk.total_space() as f64 / 1024.0 / 1024.0 / 1024.0;
        disk_used += (disk.total_space() - disk.available_space()) as f64 / 1024.0 / 1024.0 / 1024.0;
    }

    SystemStats {
        cpu_usage,
        total_ram,
        used_ram,
        total_swap,
        disk_total,
        disk_used,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_system_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
