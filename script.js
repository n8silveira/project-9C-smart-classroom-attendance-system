// citation: adapted some help from ChatGPT for functionality and Base44 for good UI/UX ideas

// simulation: 25 students
const students = [];
for (let i = 1; i <= 25; i++) {
  students.push({
    id: i,
    name: `Student ${i}`,
    status: 'Absent',
    time: '-',
    selected: false
  });
}

const statusEl = document.getElementById('status');
const tbody = document.getElementById('students-body');
const connectBtn = document.getElementById('connect-btn');

const totalEl = document.getElementById('totalStudents');
const presentEl = document.getElementById('presentCount');
const absentEl = document.getElementById('absentCount');

const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');


// update dashboard stats
function updateStats() {
  const present = students.filter(s => s.status === 'Present').length;
  const absent = students.length - present;

  presentEl.textContent = present;
  absentEl.textContent = absent;

  const rate = Math.round((present / students.length) * 100);
  progressFill.style.width = rate + '%';
  progressPercent.textContent = rate + '%';
}


// render table
function renderTable() {
  tbody.innerHTML = '';

  students.forEach((s, index) => {
    const tr = document.createElement('tr');
    if (s.selected) tr.classList.add('selected');

    const tdName = document.createElement('td'); // student name
    tdName.textContent = s.name;

    const tdStatus = document.createElement('td'); // status
    const dot = document.createElement('span');
    dot.className = 'status-dot ' + (s.status === 'Present' ? 'status-present' : 'status-absent');

    const statusText = document.createElement('span');
    statusText.textContent = s.status;
    tdStatus.appendChild(dot);
    tdStatus.appendChild(statusText);

    const tdTime = document.createElement('td'); // time of scan
    tdTime.textContent = s.time;

    // row click highlight
    tr.addEventListener('click', () => {
      s.selected = !s.selected;
      renderTable();
    });

    tr.appendChild(tdName);
    tr.appendChild(tdStatus);
    tr.appendChild(tdTime);

    tbody.appendChild(tr);
  });

  updateStats();
}

renderTable();


// handle SCAN lines from arduino
function handleLine(line) {
  if (!line.startsWith('SCAN')) return;

  const studentId = parseInt(line.split(' ')[1], 10);
  if (isNaN(studentId) || studentId < 1 || studentId > 25) return;

  const s = students[studentId - 1];
  s.status = 'Present';
  s.time = new Date().toLocaleString();

  renderTable();
}


// web serial connection
let port;
let reader;

async function connectSerial() {
  if (!('serial' in navigator)) {
    alert('Web Serial API not supported. Use Chrome or Edge.');
    return;
  }

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    statusEl.textContent = 'Connected — waiting for scans...';

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += value;
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim().length) handleLine(line.trim());
      }
    }

  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error connecting: ' + err;
  }
}

connectBtn.addEventListener('click', connectSerial);
