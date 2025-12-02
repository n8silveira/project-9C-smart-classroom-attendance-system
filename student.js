document.getElementById("submit-code").addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;
    const name = document.getElementById("name-input").value.trim();
    const message = document.getElementById("message");

    // Validate inputs
    if (!name) {
        message.textContent = "Please enter your name.";
        message.style.color = "red";
        return;
    }

    if (code.length !== 5) {
        message.textContent = "Code must be 5 digits.";
        message.style.color = "red";
        return;
    }

    // TEMP: use static student ID until login system is connected
    const studentId = "TEMP-" + name.replace(" ", "_").toUpperCase();

    try {
        // Send POST to the backend
        const response = await fetch("http://localhost:3000/attendance/check_in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, name, code })
        });

        const result = await response.json();

        if (result.success) {
            message.textContent = "Attendance recorded!";
            message.style.color = "lightgreen";
        } else {
            message.textContent = result.message || "Error recording attendance.";
            message.style.color = "red";
        }
    } catch (err) {
        message.textContent = "Server not responding.";
        message.style.color = "red";
    }
});
