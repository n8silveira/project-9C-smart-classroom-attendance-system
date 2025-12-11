// ========================
// Create student list
// ========================
const students = [];
for (let i = 1; i <= 25; i++) {
  students.push({
    id: i,
    name: `Student ${i}`,
    status: "Absent",
    time: "-"
  });
}

const tbody = document.getElementById("students-body");
const presentEl = document.getElementById("presentCount");
const absentEl = document.getElementById("absentCount");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// Modal
const modal = document.getElementById("profileModal");
const closeModal = document.getElementById("closeModal");

// Chart
let attendanceChart;

// ========================
// Render Table
// ========================
function renderTable() {
  tbody.innerHTML = "";

  students.forEach(s => {
    const tr = document.createElement("tr");

    tr.onclick = () => {
      if (s.id === 1) openProfileModal();
    };

    tr.innerHTML = `
      <td>${s.name}</td>
      <td><span class="status-dot ${s.status === "Present" ? "status-present" : "status-absent"}"></span>${s.status}</td>
      <td>${s.time}</td>
    `;

    tbody.appendChild(tr);
  });

  updateStats();
}

// ========================
// Update Dashboard Stats
// ========================
function updateStats() {
  const present = students.filter(s => s.status === "Present").length;
  const absent = students.length - present;

  presentEl.textContent = present;
  absentEl.textContent = absent;

  const percent = Math.round((present / students.length) * 100);
  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";

  updateAttendanceChart();
}

// ========================
// SMALL ATTENDANCE DONUT CHART
// ========================
function updateAttendanceChart() {
  const present = students.filter(s => s.status === "Present").length;
  const absent = students.length - present;

  const ctx = document.getElementById("attendanceChart").getContext("2d");

  if (attendanceChart) attendanceChart.destroy();

  attendanceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: [present, absent],
        backgroundColor: ["#16a34a", "#dc2626"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: { legend: false }
    }
  });
}

// ========================
// SIMPLE STUDENT INFO MODAL
// ========================
function openProfileModal() {
  document.getElementById("info-name").textContent = "Student 1";
  document.getElementById("info-email").textContent = "student1@umb.edu";
  document.getElementById("info-phone").textContent = "+1 (312) 555-1234";
  document.getElementById("info-id").textContent = "U12345678";
  document.getElementById("info-course").textContent = "CS 410";
  document.getElementById("info-major").textContent = "Computer Science";

  modal.style.display = "flex";
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// ========================
// Handle SCAN input from Arduino
// ========================
function handleLine(line) {
  if (!line.startsWith("SCAN")) return;

  const id = parseInt(line.split(" ")[1]);
  const s = students[id - 1];

  s.status = "Present";
  s.time = new Date().toLocaleTimeString();

  renderTable();
}

// ========================
// Web Serial
// ========================
let port;

document.getElementById("connect-btn").onclick = async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      const lines = buffer.split("\n");
      buffer = lines.pop();
      lines.forEach(l => handleLine(l.trim()));
    }
  } catch (err) {
    console.error("Serial error:", err);
  }
};

// ========================
// Reset Attendance
// ========================
document.getElementById("reset-btn").onclick = () => {
  students.forEach(s => {
    s.status = "Absent";
    s.time = "-";
  });
  renderTable();
};

// ========================
// Export CSV
// ========================
document.getElementById("export-btn").onclick = () => {
  let csv = "Student,Status,Time\n";
  students.forEach(s => {
    csv += `${s.name},${s.status},${s.time}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "attendance.csv";
  a.click();
};

// Initial render
renderTable();
