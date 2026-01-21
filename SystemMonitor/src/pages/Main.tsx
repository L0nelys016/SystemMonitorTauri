import { createSignal, onCleanup } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "./Pages.css";

type SystemStats = {
  cpu_usage: number;
  total_ram: number;
  used_ram: number;
  total_swap: number;
  disk_total: number;
  disk_used: number;
};

export default function Main() {
  // сигнал для метрик
  const [stats, setStats] = createSignal<SystemStats | null>(null);

  // функция для запроса метрик из Rust
  const fetchStats = async () => {
    try {
      const result = await invoke<SystemStats>("get_system_stats");
      setStats(result);
    } catch (e) {
      console.error("Failed to get system stats:", e);
    }
  };

  // первый вызов и установка интервала
  fetchStats();
  const interval = setInterval(fetchStats, 2000);

  // очистка интервала при размонтировании
  onCleanup(() => clearInterval(interval));

  return (
    <div class="panel">
      {/* Заголовок */}
      <div class="panel-title">System Monitor</div>

      {/* Верхний ряд: CPU + GPU */}
      <div class="top-row">
        <div class="card">
          <h3>CPU</h3>
          <div class="metric cpu">
            {stats() ? stats()!.cpu_usage.toFixed(1) + "%" : "Loading..."}
          </div>
        </div>

        <div class="card">
          <h3>GPU</h3>
          <div class="metric gpu">
            {/* Пока GPU нет, ставим 0%, потом можно подключить Rust */}
            0%
          </div>
        </div>
      </div>

      {/* Нижний ряд: RAM */}
      <div class="card">
        <h3>RAM usage</h3>
        <div class="progress-label">
          {stats()
            ? `${Math.round(stats()!.used_ram)} MB / ${Math.round(stats()!.total_ram)} MB`
            : "Loading..."}
        </div>
        <div class="progress">
          <div
            class="progress-fill ram"
            style={{
              width: stats() ? `${(stats()!.used_ram / stats()!.total_ram) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Нижний ряд: Disk */}
      <div class="card">
        <h3>Disk usage</h3>
        <div class="progress-label">
          {stats()
            ? `${Math.round(stats()!.disk_used)} GB / ${Math.round(stats()!.disk_total)} GB`
            : "Loading..."}
        </div>
        <div class="progress">
          <div
            class="progress-fill disk"
            style={{
              width: stats() ? `${(stats()!.disk_used / stats()!.disk_total) * 100}%` : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
