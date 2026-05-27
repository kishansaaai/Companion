import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE_PATH = path.join(DATA_DIR, "threads.json");

export const loadThreads = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            return [];
        }
        console.error("Error loading threads:", err);
        return [];
    }
};

export const saveThreads = async (threads) => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(FILE_PATH, JSON.stringify(threads, null, 2), "utf8");
    } catch (err) {
        console.error("Error saving threads:", err);
    }
};
