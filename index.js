// index.js
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FOLDER_PATH = path.join(__dirname, 'timestamps');

// Ensure the folder exists
async function ensureFolderExists(folder) {
    try {
        await fs.mkdir(folder, { recursive: true });
    } catch (err) {
        console.error('Failed to create folder', err);
    }
}
await ensureFolderExists(FOLDER_PATH);

// API endpoint to create a text file with the current timestamp
app.post('/create-timestamp', async (req, res) => {
    const timestamp = new Date().toISOString();
    const filename = timestamp.replace(/[:.]/g, '-') + '.txt';
    const filePath = path.join(FOLDER_PATH, filename);

    try {
        await fs.writeFile(filePath, timestamp, 'utf8');
        res.status(201).json({ message: 'File created successfully', filename });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create file', error: err.message });
    }
});

// API endpoint to retrieve all text files in the folder
app.get('/timestamps', async (req, res) => {
    try {
        const files = await fs.readdir(FOLDER_PATH);
        res.status(200).json({ files });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve files', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
