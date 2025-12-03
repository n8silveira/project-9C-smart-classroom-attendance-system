// ----------------------------
// Node.js Express Server (ES Modules)
// ----------------------------

import express from 'express';
import cors from 'cors';
import path from 'path';
import open from 'open';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve public folder
app.use(express.static(path.join(__dirname, '../public')));

// Instructor Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Student scan page
app.get('/scan', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/scan.html'));
});

// Session generator
app.get('/generate-session', async (req, res) => {
    try {
        const sessionId =
            "session_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);

        const classID = "CS101";

        const sessionURL =
            `http://10.0.0.179:3000/scan?session=${sessionId}&class=${classID}`;

        const qrImage = await QRCode.toDataURL(sessionURL);

        res.json({
            sessionId: sessionId,
            classId: classID,
            qrCode: qrImage
        });

    } catch (err) {
        console.error("QR generation error:", err);
        res.status(500).json({ error: "Failed to generate QR" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server running at ${url}`);
    open(url);
});
