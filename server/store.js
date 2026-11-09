import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_VEHICLES, SEED_PACKAGES, SEED_INTERESTS } from './seed-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_LOGS = [
  {
    id: 'log-01',
    interestId: 'int-01',
    adminName: 'Amma Travels Admin',
    action: 'Stage Changed',
    notes: 'Stage updated from Documents Verified to Confirmed after advance receipt.',
    createdAt: '2026-10-26T14:30:00.000Z',
  },
  {
    id: 'log-02',
    interestId: 'int-03',
    adminName: 'Amma Travels Admin',
    action: 'Meeting Scheduled',
    notes: 'Site visit fixed at Uppada resort on 29th Oct 10:00 AM.',
    createdAt: '2026-10-27T09:10:00.000Z',
  },
];

function loadData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [...SEED_VEHICLES],
        packages: Array.isArray(parsed.packages) ? parsed.packages : [...SEED_PACKAGES],
        interests: Array.isArray(parsed.interests) ? parsed.interests : [...SEED_INTERESTS],
        activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : INITIAL_LOGS,
        nextVehicleSeq: parsed.nextVehicleSeq || 1007,
        nextEventSeq: parsed.nextEventSeq || 2005,
      };
    }
  } catch (err) {
    console.error('[Store] Error reading store.json, falling back to seed:', err);
  }

  // Initialize fresh store
  const initial = {
    vehicles: [...SEED_VEHICLES],
    packages: [...SEED_PACKAGES],
    interests: [...SEED_INTERESTS],
    activityLogs: INITIAL_LOGS,
    nextVehicleSeq: 1007,
    nextEventSeq: 2005,
  };
  saveData(initial);
  return initial;
}

function saveData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Write atomically via temporary file
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[Store] Error saving store.json:', err);
  }
}

export const db = {
  data: loadData(),
  save() {
    saveData(this.data);
  },
  reload() {
    this.data = loadData();
    return this.data;
  },
};
