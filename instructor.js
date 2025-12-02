document.addEventListener("DOMContentLoaded", () => {

    // temporary list of classes (replace w database later)
    const classes = [
        { name: "CS 240 - C Programming", schedule: "Mon & Wed — 9:00 AM" },
        { name: "CS 410 - Intro to Software Engineering", schedule: "Tue & Thu — 12:30 PM" },
        { name: "CS 444 - Operating Systems", schedule: "Fri — 11:00 AM" }
    ];

    // random 5-digit code for each class
    classes.forEach(c => {
        c.code = Math.floor(10000 + Math.random() * 90000); // 5-digit
    });

    const tabsContainer = document.getElementById("class-tabs");
    const content = document.getElementById("class-content");
    const realtimeArea = document.getElementById("realtime-attendance");

    // create tabs
    classes.forEach((cls, index) => {
        const tab = document.createElement("div");
        tab.classList.add("tab");
        if (index === 0) {
            tab.classList.add("active");
        }
        tab.textContent = cls.name;
        tab.dataset.index = index;

        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            loadClass(index);
        });

        tabsContainer.appendChild(tab);
    });

    // Default load first class
    loadClass(0);

    function loadClass(i) {
        const c = classes[i];

        content.innerHTML = `
            <h2>${c.name}</h2>
            <p><strong>Schedule:</strong> ${c.schedule}</p>
            <p><strong>Attendance Code:</strong>
                <span style="font-size: 1.4em;">${c.code}</span>
            </p>
            <h3>Real-Time Attendance</h3>

            <div id="realtime-attendance">
                <p>Loading student data...</p>
            </div>
        `;

        // Start pulling live attendance for this class
        startRealtimeUpdates(c.code);
    }

    // ================================
    // 4. REAL-TIME ATTENDANCE CHECKER
    // ================================
    let updateInterval = null;

    function startRealtimeUpdates(classCode) {
        // Clear previous interval if switching tabs
        if (updateInterval) clearInterval(updateInterval);

        // Load immediately, then refresh every 3 sec
        fetchAttendance(classCode);
        updateInterval = setInterval(() => fetchAttendance(classCode), 3000);
    }


    // ================================
    // 5. FETCH ATTENDANCE FROM SERVER
    // (replace endpoint with your real backend route)
    // ================================
    function fetchAttendance(classCode) {

        // Temporary MOCK data
        // Replace this later with:
        // fetch(`/attendance/${classCode}`)
        const mockStudents = [
            { name: "Alice Johnson", present: Math.random() > 0.5 },
            { name: "Brian Lee", present: Math.random() > 0.3 },
            { name: "Carlos Gomez", present: Math.random() > 0.2 }
        ];

        const presentStudents = mockStudents.filter(s => s.present);

        const container = document.getElementById("realtime-attendance");

        if (presentStudents.length === 0) {
            container.innerHTML = `<p>No students have checked in yet.</p>`;
            return;
        }

        container.innerHTML = `
            <ul>
                ${presentStudents.map(s => `<li>${s.name}</li>`).join("")}
            </ul>
        `;
    }

});
