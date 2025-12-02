document.getElementById("submit-code").addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;
    const message = document.getElementById("message");

    if (code.length !== 5) {
        message.textContent = "Code must be 5 digits.";
        return;
    }

    // TEMP: use static student ID until login system is connected
    const studentId = "STUDENT123";

    // Send POST to the backend
    const response = await fetch("http://localhost:3000/attendance/check_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, code })
    });

    const result = await response.json();

    if (result.success) {
        message.textContent = "Attendance recorded!";
        message.style.color = "lightgreen";
    } else {
        message.textContent = result.message;
        message.style.color = "red";
    }
});
