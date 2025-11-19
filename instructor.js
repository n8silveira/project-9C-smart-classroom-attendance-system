document.addEventListener("DOMContentLoaded", () => {

    // list of classes (replace w database later)
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
            <p><strong>Attendance Code:</strong> <span style="font-size: 1.4em;">${c.code}</span></p>
        `;
    }

});
