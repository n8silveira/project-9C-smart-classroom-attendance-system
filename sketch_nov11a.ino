#include <LiquidCrystal.h>

// -------------------- LCD SETUP --------------------
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);  // RS, E, D4, D5, D6, D7

// -------------------- ULTRASONIC SENSOR --------------------
#define trigPin 9
#define echoPin 10

// -------------------- RGB LED & BUZZER --------------------
// Leg 1 (BLUE)  -> A0  (through 220Ω resistor)
// Leg 2 (GREEN) -> 8   (through 220Ω resistor)
// Leg 3 (LONG)  -> GND
// Leg 4 (RED)   -> 7   (through 220Ω resistor)
#define BLUELED  A0
#define GREENLED 8
#define REDLED   7
#define BUZZER   13   // active buzzer (+), (-) to GND

// -------------------- ATTENDANCE STATE --------------------
int currentStudent = 1;
const int maxStudents = 25;
bool wasNear = false;

// -------------------- SERIAL INPUT BUFFER (for RESET cmd) --------------------
String inputLine = "";

// -------------------- SETUP --------------------
void setup() {
  Serial.begin(9600);

  lcd.begin(16, 2);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(REDLED, OUTPUT);
  pinMode(GREENLED, OUTPUT);
  pinMode(BLUELED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Start in idle: red LED, "Please scan card"
  setColor(true, false, false);  // red on
  digitalWrite(BUZZER, LOW);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Smart Attendance");
  delay(1500);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Please scan card");
}

// -------------------- DISTANCE FUNCTION --------------------
long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout
  if (duration == 0) return 400;                 // no echo

  return duration * 0.034 / 2;                   // cm
}

// -------------------- RGB HELPER --------------------
void setColor(bool r, bool g, bool b) {
  // COMMON CATHODE: HIGH = ON
  digitalWrite(REDLED,   r ? HIGH : LOW);
  digitalWrite(GREENLED, g ? HIGH : LOW);
  digitalWrite(BLUELED,  b ? HIGH : LOW);
}

// -------------------- SERIAL COMMAND HANDLER --------------------
void handleSerial() {
  while (Serial.available()) {
    char c = Serial.read();

    // Treat newline or carriage return as end of command
    if (c == '\n' || c == '\r') {
      if (inputLine.length() > 0) {
        if (inputLine == "RESET") {
          // Reset student counter
          currentStudent = 1;
          wasNear = false; // optional: avoid immediate re-trigger

          // Optional: brief LCD feedback
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Reset complete");
          delay(500);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Please scan card");
        }
      }
      inputLine = ""; // clear buffer
    } else {
      // Add printable chars to the buffer
      if (c >= 32 && c <= 126) {
        inputLine += c;
      }
    }
  }
}

// -------------------- MAIN LOOP --------------------
void loop() {
  // First, check if any serial command came in (e.g. RESET from web app)
  handleSerial();

  long distance = getDistance();
  bool near = (distance <= 1);   // is card in front of scanner?

  // ---- scanner event: when we go from far -> near ----
  if (near && !wasNear && currentStudent <= maxStudents) {
    // Simulate a card scan for this student
    Serial.print("SCAN ");
    Serial.println(currentStudent);

    // Beep + green LED
    setColor(false, true, false);   // green
    digitalWrite(BUZZER, HIGH);

    // Greeting on LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Hello, Student");
    lcd.setCursor(0, 1);
    lcd.print(currentStudent);

    delay(800);   // show greeting + beep briefly, 0.8 second

    // Stop beep
    digitalWrite(BUZZER, LOW);

    // Return to idle: red LED, "Please scan card"
    setColor(true, false, false);   // red
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Please scan card");

    currentStudent++;
  }
  // ---- IDLE: no object close -> red LED, no beep ----
  else if (!near) {
    setColor(true, false, false);   // red on
    digitalWrite(BUZZER, LOW);
    // LCD already shows "Please scan card" from setup or last scan
  }

  wasNear = near;
  delay(100);
}