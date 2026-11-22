import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './store.js';
import { authenticate, requireAuth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=()');
  next();
});

// Lightweight In-Memory Rate Limiting
function createRateLimiter({ windowMs, maxRequests, message }) {
  const ipCounts = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCounts.entries()) {
      if (now > record.resetTime) {
        ipCounts.delete(ip);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let record = ipCounts.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      ipCounts.set(ip, record);
      return next();
    }

    record.count += 1;
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message || 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many login attempts. Please wait 15 minutes before retrying.',
});

const interestRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Submission limit reached. Please wait before submitting another enquiry or contact us directly on WhatsApp.',
});

// In-memory cache for device/IP submissions to block rapid flood attacks
const recentIpSubmissions = new Map();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check Endpoint (for Docker/Render/Cloud monitoring)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ammatravels-api',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    store: {
      vehiclesCount: db.data.vehicles.length,
      packagesCount: db.data.packages.length,
      interestsCount: db.data.interests.length,
    },
  });
});

// ==========================================
// 1. VEHICLE ROUTES
// ==========================================

// GET /api/vehicles (Public, filterable)
app.get('/api/vehicles', (req, res) => {
  const { type, subType, transmission, fuel, seats, maxPrice, status, search } = req.query;
  let result = [...db.data.vehicles];

  if (type && type !== 'all') {
    result = result.filter((v) => v.type === type);
  }
  if (subType && subType !== 'all') {
    result = result.filter((v) => v.subType?.toLowerCase() === subType.toLowerCase());
  }
  if (transmission && transmission !== 'all') {
    result = result.filter((v) => v.transmission === transmission);
  }
  if (fuel && fuel !== 'all') {
    result = result.filter((v) => v.fuel === fuel);
  }
  if (seats && seats !== 'all') {
    result = result.filter((v) => String(v.seats) === String(seats));
  }
  if (maxPrice) {
    result = result.filter((v) => v.pricePerDay <= Number(maxPrice));
  }
  if (status && status !== 'all') {
    result = result.filter((v) => v.status === status);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, vehicles: result });
});

// GET /api/vehicles/:id (Public, 360 viewer sequence)
app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = db.data.vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }

  const baseImg = vehicle.primaryImage;
  const frames360 = Array.from({ length: 36 }, (_, i) => `${baseImg}&angle=${i * 10}`);
  const interestedLeads = db.data.interests.filter((i) => i.vehicleId === vehicle.id);

  res.json({
    success: true,
    vehicle: {
      ...vehicle,
      frames360,
      interestedLeadsCount: interestedLeads.length,
      interestedLeads,
    },
  });
});

// POST /api/vehicles (Admin only)
app.post('/api/vehicles', requireAuth(['admin']), (req, res) => {
  const newVehicle = {
    ...req.body,
    id: `v-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.data.vehicles.unshift(newVehicle);
  db.save();
  res.status(201).json({ success: true, vehicle: newVehicle });
});

// PUT /api/vehicles/:id (Admin only)
app.put('/api/vehicles/:id', requireAuth(['admin']), (req, res) => {
  const idx = db.data.vehicles.findIndex((v) => v.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
  db.data.vehicles[idx] = {
    ...db.data.vehicles[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  db.save();
  res.json({ success: true, vehicle: db.data.vehicles[idx] });
});

// DELETE /api/vehicles/:id (Admin only)
app.delete('/api/vehicles/:id', requireAuth(['admin']), (req, res) => {
  db.data.vehicles = db.data.vehicles.filter((v) => v.id !== req.params.id);
  db.save();
  res.json({ success: true, message: 'Vehicle removed from fleet' });
});

// ==========================================
// 2. EVENT PACKAGES ROUTES
// ==========================================

// GET /api/packages (Public)
app.get('/api/packages', (req, res) => {
  const { eventType } = req.query;
  let result = [...db.data.packages];
  if (eventType && eventType !== 'all') {
    result = result.filter((p) => p.eventType?.toLowerCase() === eventType.toLowerCase());
  }
  res.json({ success: true, count: result.length, packages: result });
});

// GET /api/packages/:id (Public)
app.get('/api/packages/:id', (req, res) => {
  const pkg = db.data.packages.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, error: 'Package not found' });
  }
  const interestedLeads = db.data.interests.filter((i) => i.packageId === pkg.id);
  res.json({
    success: true,
    package: { ...pkg, interestedLeadsCount: interestedLeads.length, interestedLeads },
  });
});

// POST /api/packages (Admin only)
app.post('/api/packages', requireAuth(['admin']), (req, res) => {
  const newPkg = {
    ...req.body,
    id: `pkg-${Date.now()}`,
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `pkg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.data.packages.unshift(newPkg);
  db.save();
  res.status(201).json({ success: true, package: newPkg });
});

// PUT /api/packages/:id (Admin only)
app.put('/api/packages/:id', requireAuth(['admin']), (req, res) => {
  const idx = db.data.packages.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Package not found' });
  }
  db.data.packages[idx] = {
    ...db.data.packages[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  db.save();
  res.json({ success: true, package: db.data.packages[idx] });
});

// DELETE /api/packages/:id (Admin only)
app.delete('/api/packages/:id', requireAuth(['admin']), (req, res) => {
  db.data.packages = db.data.packages.filter((p) => p.id !== req.params.id);
  db.save();
  res.json({ success: true, message: 'Package removed' });
});

// ==========================================
// 3. INTEREST SUBMISSIONS & CRM PIPELINE
// ==========================================

// POST /api/interests (Customer submit interest form - Public)
app.post('/api/interests', interestRateLimiter, (req, res) => {
  // Honeypot spam protection
  if (req.body._honeypot || req.body.honeypot || req.body.website_source || req.body.user_anti_spam) {
    return res.status(400).json({ success: false, error: 'Spam detected' });
  }

  const { type, name, phone, email } = req.body;
  if (!name || !phone || !type) {
    return res.status(400).json({ success: false, error: 'Name, phone, and type are required' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  if (cleanPhone.length < 10) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number' });
  }

  // Active enquiry state check helper
  const isTerminal = (stage, status) => {
    return ['Completed', 'Rejected', 'Cancelled'].includes(stage) || status === 'Cancelled' || status === 'Completed';
  };

  // 1. Strict duplicate check by phone number (1 active enquiry per user)
  const existingByPhone = db.data.interests.find((i) => {
    const iPhone = (i.phone || '').replace(/[^0-9]/g, '').slice(-10);
    return iPhone === cleanPhone && !isTerminal(i.progressStage, i.status);
  });

  if (existingByPhone) {
    return res.status(409).json({
      success: false,
      error: `You already have an active reservation enquiry (Ref ID: ${existingByPhone.refId}). To prevent duplicate bookings and spam attacks, only 1 active enquiry is permitted per user.`,
      refId: existingByPhone.refId,
      existing: {
        refId: existingByPhone.refId,
        itemName: existingByPhone.vehicleName || existingByPhone.packageName,
        progressStage: existingByPhone.progressStage,
        status: existingByPhone.status,
        createdAt: existingByPhone.createdAt,
      },
    });
  }

  // 2. Strict duplicate check by email if provided
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (cleanEmail) {
    const existingByEmail = db.data.interests.find((i) => {
      const iEmail = (i.email || '').trim().toLowerCase();
      return iEmail === cleanEmail && !isTerminal(i.progressStage, i.status);
    });

    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        error: `An active enquiry (Ref ID: ${existingByEmail.refId}) is already linked with ${cleanEmail}. Submissions are limited to 1 active enquiry per user.`,
        refId: existingByEmail.refId,
        existing: {
          refId: existingByEmail.refId,
          itemName: existingByEmail.vehicleName || existingByEmail.packageName,
          progressStage: existingByEmail.progressStage,
          status: existingByEmail.status,
          createdAt: existingByEmail.createdAt,
        },
      });
    }
  }

  // 3. Device/IP cooldown to stop rapid automated bot spam
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const lastIpSubmission = recentIpSubmissions.get(clientIp);
  if (lastIpSubmission && Date.now() - lastIpSubmission.timestamp < 3 * 60 * 1000) {
    return res.status(429).json({
      success: false,
      error: `An enquiry has already been submitted from this device recently. Please track your active enquiry (Ref ID: ${lastIpSubmission.refId}) or wait before submitting another.`,
      refId: lastIpSubmission.refId,
    });
  }

  // Reference ID Generator
  let refId = '';
  if (type === 'vehicle') {
    refId = `AT-V-${db.data.nextVehicleSeq}`;
    db.data.nextVehicleSeq += 1;
  } else {
    refId = `AT-E-${db.data.nextEventSeq}`;
    db.data.nextEventSeq += 1;
  }

  const newInterest = {
    id: `int-${Date.now()}`,
    refId,
    type,
    vehicleId: req.body.vehicleId,
    vehicleName: req.body.vehicleName,
    packageId: req.body.packageId,
    packageName: req.body.packageName,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    pickupDate: req.body.pickupDate,
    returnDate: req.body.returnDate,
    pickupLocation: req.body.pickupLocation || 'Kakinada Hub (Main Road)',
    idProofUrl: req.body.idProofUrl,
    eventType: req.body.eventType,
    eventDate: req.body.eventDate,
    guestCount: req.body.guestCount ? Number(req.body.guestCount) : undefined,
    budgetRange: req.body.budgetRange,
    cityVenue: req.body.cityVenue || 'Kakinada, AP',
    message: req.body.message,
    status: 'Submitted',
    progressStage: 'New',
    internalNotes: 'Form submitted from public portal. Awaiting staff contact.',
    followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.data.interests.unshift(newInterest);

  // Log initial activity
  db.data.activityLogs.unshift({
    id: `log-${Date.now()}`,
    interestId: newInterest.id,
    adminName: 'System Engine',
    action: 'Enquiry Received',
    notes: `Customer enquiry received for ${newInterest.vehicleName || newInterest.packageName}. Reference ID: ${refId}.`,
    createdAt: new Date().toISOString(),
  });

  recentIpSubmissions.set(clientIp, { timestamp: Date.now(), refId });

  db.save();

  res.status(201).json({
    success: true,
    refId,
    interest: newInterest,
    message: 'Your enquiry has been received. Our team will contact you shortly.',
  });
});

// GET /api/interests (Admin/Staff only)
app.get('/api/interests', requireAuth(), (req, res) => {
  const { type, stage, status, search, vehicleId, packageId } = req.query;
  let result = [...db.data.interests];

  if (type && type !== 'all') {
    result = result.filter((i) => i.type === type);
  }
  if (stage && stage !== 'all') {
    result = result.filter((i) => i.progressStage === stage);
  }
  if (status && status !== 'all') {
    result = result.filter((i) => i.status === status);
  }
  if (vehicleId) {
    result = result.filter((i) => i.vehicleId === vehicleId);
  }
  if (packageId) {
    result = result.filter((i) => i.packageId === packageId);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        i.refId.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.phone.includes(q) ||
        (i.vehicleName && i.vehicleName.toLowerCase().includes(q)) ||
        (i.packageName && i.packageName.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: result.length, interests: result });
});

// GET /api/interests/:id (Admin/Staff only)
app.get('/api/interests/:id', requireAuth(), (req, res) => {
  const item = db.data.interests.find((i) => i.id === req.params.id || i.refId === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  const logs = db.data.activityLogs.filter((l) => l.interestId === item.id);
  res.json({ success: true, interest: item, activityLogs: logs });
});

// PUT /api/interests/:id (Admin/Staff only)
app.put('/api/interests/:id', requireAuth(), (req, res) => {
  const idx = db.data.interests.findIndex((i) => i.id === req.params.id || i.refId === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  const previousStage = db.data.interests[idx].progressStage;
  const { progressStage, internalNotes, followUpDate, status, adminName } = req.body;

  db.data.interests[idx] = {
    ...db.data.interests[idx],
    progressStage: progressStage || db.data.interests[idx].progressStage,
    internalNotes: internalNotes !== undefined ? internalNotes : db.data.interests[idx].internalNotes,
    followUpDate: followUpDate !== undefined ? followUpDate : db.data.interests[idx].followUpDate,
    status:
      status ||
      (progressStage === 'Confirmed'
        ? 'Confirmed'
        : progressStage === 'Completed'
        ? 'Completed'
        : db.data.interests[idx].status),
    updatedAt: new Date().toISOString(),
  };

  // Add activity log entry
  if (progressStage && progressStage !== previousStage) {
    db.data.activityLogs.unshift({
      id: `log-${Date.now()}`,
      interestId: db.data.interests[idx].id,
      adminName: adminName || (req.user?.role === 'admin' ? 'Amma Travels Admin' : 'Amma Travels Staff'),
      action: 'Stage Changed',
      notes: `Progress stage transitioned from '${previousStage}' to '${progressStage}'. ${
        internalNotes ? `Note: ${internalNotes}` : ''
      }`,
      createdAt: new Date().toISOString(),
    });
  } else if (internalNotes) {
    db.data.activityLogs.unshift({
      id: `log-${Date.now()}`,
      interestId: db.data.interests[idx].id,
      adminName: adminName || (req.user?.role === 'admin' ? 'Amma Travels Admin' : 'Amma Travels Staff'),
      action: 'Note Logged',
      notes: internalNotes,
      createdAt: new Date().toISOString(),
    });
  }

  db.save();

  res.json({ success: true, interest: db.data.interests[idx] });
});

// ==========================================
// 4. PUBLIC ENQUIRY TRACKER
// ==========================================

// GET /api/track?refId=...&phone=... (Public lookup)
app.get('/api/track', (req, res) => {
  const { refId, phone } = req.query;
  if (!refId || !phone) {
    return res.status(400).json({ success: false, error: 'Reference ID and Phone number are required' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  const found = db.data.interests.find(
    (i) =>
      i.refId.toUpperCase() === refId.toUpperCase() &&
      i.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone
  );

  if (!found) {
    return res.status(404).json({
      success: false,
      error: 'No enquiry found matching this Reference ID and phone number. Please verify your details.',
    });
  }

  res.json({
    success: true,
    tracking: {
      refId: found.refId,
      type: found.type,
      itemName: found.vehicleName || found.packageName,
      customerName: found.name,
      pickupDate: found.pickupDate || found.eventDate,
      returnDate: found.returnDate,
      pickupLocation: found.pickupLocation || found.cityVenue,
      status: found.status,
      progressStage: found.progressStage,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    },
  });
});

// ==========================================
// 5. ADMIN DASHBOARD STATS
// ==========================================

// GET /api/stats (Admin/Staff only)
app.get('/api/stats', requireAuth(), (req, res) => {
  const totalVehicles = db.data.vehicles.length;
  const availableVehicles = db.data.vehicles.filter((v) => v.status === 'Available').length;
  const bookedVehicles = db.data.vehicles.filter((v) => v.status === 'Booked').length;
  const maintenanceVehicles = db.data.vehicles.filter((v) => v.status === 'Maintenance').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const newEnquiriesToday = db.data.interests.filter((i) => i.createdAt.startsWith(todayStr)).length;
  const confirmedBookings = db.data.interests.filter((i) => i.progressStage === 'Confirmed').length;
  const eventEnquiries = db.data.interests.filter((i) => i.type === 'event').length;

  const estimatedRevenue = db.data.interests
    .filter((i) => i.status === 'Confirmed' || i.status === 'Completed')
    .reduce((sum, i) => sum + (i.type === 'vehicle' ? 3500 : 75000), 0);

  const enquiriesOverTime = [
    { date: 'Nov 17', count: 4 },
    { date: 'Nov 18', count: 6 },
    { date: 'Nov 19', count: 8 },
    { date: 'Nov 20', count: 12 },
    { date: 'Nov 21', count: 9 },
  ];

  const mostRequestedVehicles = [
    { name: 'Mahindra Thar Roxx Star Edition (5-Door)', count: 16 },
    { name: 'Toyota Innova Crysta 2.4 VX', count: 14 },
    { name: 'Royal Enfield Continental GT 650', count: 12 },
    { name: 'Mahindra XUV 7XO AX7 L Automatic', count: 10 },
    { name: 'Honda Activa 6G', count: 9 },
  ];

  res.json({
    success: true,
    stats: {
      totalVehicles,
      availableVehicles,
      bookedVehicles,
      maintenanceVehicles,
      newEnquiriesToday,
      confirmedBookings,
      eventEnquiries,
      estimatedRevenue,
      enquiriesOverTime,
      mostRequestedVehicles,
    },
  });
});

// ==========================================
// 6. AUTHENTICATION
// ==========================================

app.post('/api/auth/login', authRateLimiter, (req, res) => {
  const { username, email, password } = req.body;
  const userIdentifier = username || email;

  if (!userIdentifier || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  const result = authenticate(userIdentifier, password);
  if (!result.success) {
    return res.status(401).json({ success: false, error: result.error });
  }

  res.json({
    success: true,
    user: result.user,
    token: result.token,
  });
});

// ==========================================
// 7. PRODUCTION STATIC ASSET SERVING
// ==========================================

const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AmmaTravels Server] Express API running on port ${PORT} (0.0.0.0)`);
  console.log(`[AmmaTravels Server] Persistent storage active: ${path.join(__dirname, 'data/store.json')}`);
});
