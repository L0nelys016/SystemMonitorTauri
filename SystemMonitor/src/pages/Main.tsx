import "./Pages.css";

export default function Main() {
  return (
      <div class="panel">
        {/* Заголовок */}
        <div class="panel-title">System Monitor</div>

        {/* Верхний ряд: CPU + GPU */}
        <div class="top-row">
          <div class="card">
            <h3>CPU</h3>
            <div class="metric cpu">90%</div>
          </div>

          <div class="card">
            <h3>GPU</h3>
            <div class="metric gpu">45%</div>
          </div>
        </div>

        {/* Нижний ряд: RAM + Disk */}
        <div class="card">
          <h3>RAM usage</h3>
          <div class="progress-label">6.4 GB / 16 GB</div>
          <div class="progress">
            <div class="progress-fill ram" style={{ width: "90%" }} />
          </div>
        </div>

        <div class="card">
          <h3>Disk usage</h3>
          <div class="progress-label">720 GB / 1 TB</div>
          <div class="progress">
            <div class="progress-fill disk" style={{ width: "72%" }} />
          </div>
        </div>
      </div>
  );
}
