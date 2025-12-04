/////////////////////////////////////////////////////
//  FIREBASE CONFIG
/////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyCQgLM_dI2qGOVN4sS60nS9Y2X59H_AQWY",
  authDomain: "smart-attendance-system-ce608.firebaseapp.com",
  projectId: "smart-attendance-system-ce608",
  storageBucket: "smart-attendance-system-ce608.firebasestorage.app",
  messagingSenderId: "847178446938",
  appId: "1:847178446938:web:767f7501bea525760b0063",
  measurementId: "G-XZCN7GWJVY"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


/////////////////////////////////////////////////////
//  GOOGLE LOGIN CONFIG (UMB ONLY)
/////////////////////////////////////////////////////

const WEB_CLIENT_ID =
"847178446938-3sbkqj3o0q85rg4ogn7oo5720nroapl6.apps.googleusercontent.com";

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  hd: "umb.edu",
  client_id: WEB_CLIENT_ID
});


/////////////////////////////////////////////////////
//  LOGIN BUTTON
/////////////////////////////////////////////////////

document.getElementById("login-btn").addEventListener("click", () => {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      alert("Logged in as: " + user.email);
      console.log("Login successful:", user.email);

      document.getElementById("login-btn").style.display = "none";
      document.getElementById("logout-btn").style.display = "block";
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    });
});


/////////////////////////////////////////////////////
//  LOGOUT BUTTON
/////////////////////////////////////////////////////

document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      alert("Logged out.");
      document.getElementById("logout-btn").style.display = "none";
      document.getElementById("login-btn").style.display = "block";
    });
});


/////////////////////////////////////////////////////
//  GENERATE ATTENDANCE QR CODE (Instructor)
/////////////////////////////////////////////////////

document.getElementById("generate-qr-btn").addEventListener("click", () => {
  if (!auth.currentUser) {
    alert("Login required!");
    return;
  }

  const sessionId =
    "session_" + Date.now() + "_" + Math.floor(Math.random() * 100000);

  const scanUrl = `http://10.0.0.179:3000/scan.html?session=${sessionId}`;

  new QRCode(document.getElementById("qr-code"), {
    text: scanUrl,
    width: 220,
    height: 220
  });

  document.getElementById("current-session-id").innerText = sessionId;

  console.log("QR generated:", scanUrl);
  alert("QR Code Generated!");
});


/////////////////////////////////////////////////////
//  STUDENT SCAN PAGE — MARK ATTENDANCE
/////////////////////////////////////////////////////

if (window.location.pathname.includes("scan.html")) {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session");

  document.getElementById("session-display").innerHTML =
    "Session ID: " + sessionId;

  document.getElementById("submit-attendance-btn").addEventListener("click", () => {
    const studentEmail = document.getElementById("student-email").value.trim();

    if (!studentEmail.endsWith("@umb.edu")) {
      alert("Only UMB emails allowed.");
      return;
    }

    db.collection("Attendance")
      .doc(sessionId)
      .collection("PresentStudents")
      .doc(studentEmail)
      .set({ email: studentEmail, timestamp: new Date() })
      .then(() => {
        alert("Attendance recorded successfully!");
      });
  });
}


/////////////////////////////////////////////////////
//  LOAD ATTENDANCE (Instructor Dashboard)
/////////////////////////////////////////////////////

document.getElementById("load-attendance-btn").addEventListener("click", async () => {
  const sessionId = document.getElementById("current-session-id").innerText;

  if (!sessionId) {
    alert("Generate QR first!");
    return;
  }

  const presentList = document.getElementById("presentList");
  const absentList = document.getElementById("absentList");

  presentList.innerHTML = "";
  absentList.innerHTML = "";

  // 1. Load full class roster
  const rosterSnapshot = await db
    .collection("ClassRoster")
    .doc("CS101")
    .collection("Students")
    .get();

  const roster = rosterSnapshot.docs.map(doc => doc.id);

  // 2. Load present students for this session
  const presentSnapshot = await db
    .collection("Attendance")
    .doc(sessionId)
    .collection("PresentStudents")
    .get();

  const presentStudents = presentSnapshot.docs.map(doc => doc.id);

  // 3. Determine absent students
  const absentStudents = roster.filter(email => !presentStudents.includes(email));

  // 4. Display present students
  presentStudents.forEach(email => {
    const li = document.createElement("li");
    li.textContent = email + " ✔ PRESENT";
    li.style.color = "green";
    presentList.appendChild(li);
  });

  // 5. Display absent students
  absentStudents.forEach(email => {
    const li = document.createElement("li");
    li.textContent = email + " X ABSENT";
    li.style.color = "red";
    absentList.appendChild(li);
  });

  alert("Attendance Loaded!");
});
