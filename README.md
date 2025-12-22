# Smart Classroom Attendance System
CS 410 - Professor Fletcher

Nathaniel Silveira,
Lance Kulaksizoglu,
Manvith Chatrathi

A browser-based smart classroom attendance system that connects to an Arduino using the Web Serial API. Students are marked present when their ID is scanned, and instructors can view attendance in real time through a clean, professional dashboard.

# FEATURES
- Connects directly to an Arduino via USB
- Reads real-time scan input (SCAN <id>)
- Tracks up to 25 students
- Automatically records attendance time
- Modern UI with a professional color palette
- Present = green, Absent = red
- Runs entirely in the browser (no backend required)

# HOW TO RUN
1. Open Project
- Download / clone project foler
- Open index.html directly into we browser (Chrome)

2. Connect to Arduino
- Plug Arduino into computer via USB
- Click "Connect to Arduino"
- Select the correct USB port when prompted
- Status will change to: ["Status: Connected. Waiting for scans..."]

3. Scan Students
- When Arduino sends: [SCAN 3], the dashboard will mark "Student 3" as Present
- It will display the current timestamp and highlight the status in green

4. Instructor View
- Table displays: student name, attendance status, time of check-in

5. Demo Mode
- Table will automatically load with students
- Even without Arduino connected, open browser console and simpulate input: handleLine("SCAN 5");
