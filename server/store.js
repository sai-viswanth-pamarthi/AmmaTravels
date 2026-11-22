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
    action: 'Booking Confirmed',
    notes: 'Advance token ₹5,000 received via PhonePe. Driving license verified. Stealth Black Thar Roxx reserved.',
    createdAt: '2026-11-20T16:00:00.000Z',
  },
  {
    id: 'log-02',
    interestId: 'int-02',
    adminName: 'Amma Travels Staff',
    action: 'Documents Verified',
    notes: 'Corporate client GST and Aadhaar verified. Port delivery slot arranged.',
    createdAt: '2026-11-21T10:45:00.000Z',
  },
  {
    id: 'log-03',
    interestId: 'int-03',
    adminName: 'Amma Travels Admin',
    action: 'Airport Handover Scheduled',
    notes: 'Vehicle prepped for Rajahmundry Airport dispatch for flight arriving 11:30 AM.',
    createdAt: '2026-11-20T17:30:00.000Z',
  },
  {
    id: 'log-04',
    interestId: 'int-04',
    adminName: 'Amma Travels Admin',
    action: 'Rider Gear Allocated',
    notes: 'Continental GT 650 prepped and fueled. Helmet size L allocated.',
    createdAt: '2026-11-21T09:15:00.000Z',
  },
  {
    id: 'log-05',
    interestId: 'int-07',
    adminName: 'Amma Travels Staff',
    action: 'Meeting Scheduled',
    notes: 'Customer test ride scheduled at Kakinada Hub for Saturday 4 PM.',
    createdAt: '2026-11-21T09:30:00.000Z',
  },
  {
    id: 'log-06',
    interestId: 'int-13',
    adminName: 'Amma Travels Admin',
    action: 'Rental Completed & Refunded',
    notes: 'Duke 200 returned in flawless condition. Security deposit ₹2,000 refunded via UPI.',
    createdAt: '2026-11-21T11:00:00.000Z',
  },
  {
    id: 'log-07',
    interestId: 'int-19',
    adminName: 'Amma Travels Admin',
    action: 'Venue Site Visit Fixed',
    notes: 'Site inspection meeting fixed at Uppada Beach Resort on 23rd Nov 10:00 AM.',
    createdAt: '2026-11-20T09:10:00.000Z',
  },
  {
    id: 'log-08',
    interestId: 'int-22',
    adminName: 'Amma Travels Admin',
    action: 'Inquiry Rejected',
    notes: 'Rejected due to lack of valid permanent LMV driving license.',
    createdAt: '2026-11-21T09:40:00.000Z',
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
        nextVehicleSeq: parsed.nextVehicleSeq || 1020,
        nextEventSeq: parsed.nextEventSeq || 2004,
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
    nextVehicleSeq: 1020,
    nextEventSeq: 2004,
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
