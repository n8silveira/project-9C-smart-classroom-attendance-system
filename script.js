document.addEventListener('DOMContentLoaded', () => {
    // Get all needed elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginForms = document.querySelectorAll('.login-form');
    const studentForm = document.getElementById('student-form');
    const teacherForm = document.getElementById('teacher-form');
    const messageArea = document.getElementById('message-area');

    // Tab switchibg logic
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active'); // Clicked button is active

            const formToShow = button.getAttribute('data-form');

            // Hide forms
            loginForms.forEach(form => form.classList.add('hidden'));

            // Show target form
            document.getElementById(formToShow).classList.remove('hidden');
            
            // Clear any previous messages
            messageArea.classList.add('hidden');
            messageArea.textContent = '';
        });
    });

    // Login logic function
    // Helper function to handle login attempts
    const handleLogin = (event, userType) => {
        event.preventDefault(); // Stop form from submitting normally

        // Get email and password
        const email = document.getElementById(`${userType}-email`).value;
        const password = document.getElementById(`${userType}-password`).value;

        // Clear previous message
        messageArea.classList.remove('success', 'error');
        messageArea.classList.add('hidden');
        messageArea.textContent = '';

        // Accept any credentials as long as they are not empty for testing purposes, 
        // will add input validation later
        if (email && password) {
            // Show success message
            messageArea.textContent = `Login successful as ${userType}! Welcome, ${email}.`;
            messageArea.classList.add('success');
            messageArea.classList.remove('hidden');
            
            // Here we will later redirect to the student/teacher dashboard
            // -->
        } else {
            // Show error message
            messageArea.textContent = 'Please enter both email and password.';
            messageArea.classList.add('error');
            messageArea.classList.remove('hidden');
        }
    };

    // Attach event listeners to forms
    studentForm.addEventListener('submit', (e) => handleLogin(e, 'student'));
    teacherForm.addEventListener('submit', (e) => handleLogin(e, 'teacher'));
});