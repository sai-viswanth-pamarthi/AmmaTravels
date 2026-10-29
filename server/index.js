import express from 'express';
import cors from 'cors';
import { SEED_VEHICLES, SEED_PACKAGES, SEED_INTERESTS } from './seed-data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store seeded with comprehensive test data
let vehicles = [...SEED_VEHICLES];
let packages = [...SEED_PACKAGES];
let interests = [...SEED_INTERESTS];
let activityLogs = [
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

let nextVehicleSeq = 1007;
let nextEventSeq = 2005;

// ==========================================
// 1. VEHICLE ROUTES
// ==========================================

// GET /api/vehicles (filterable by type, seats, transmission, fuel, search)
app.get('/api/vehicles', (req, res) => {
  const { type, subType, transmission, fuel, seats, maxPrice, status, search } = req.query;
  let result = [...vehicles];

  if (type && type !== 'all') {
    result = result.filter((v) => v.type === type);
  }
  if (subType && subType !== 'all') {
    result = result.filter((v) => v.subType.toLowerCase() === subType.toLowerCase());
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

// GET /api/vehicles/:id (with procedural 36-frame 360 viewer sequence)
app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }

  // Generate 36 multi-angle camera perspective URLs for the 360 viewer
  const baseImg = vehicle.primaryImage;
  const frames360 = Array.from({ length: 36 }, (_, i) => {
    // Return sequence frame markers
    return `${baseImg}&angle=${i * 10}`;
  });

  // Also fetch list of interested leads for this specific vehicle
  const interestedLeads = interests.filter((i) => i.vehicleId === vehicle.id);

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

// POST /api/vehicles (Admin create)
app.post('/api/vehicles', (req, res) => {
  const newVehicle = {
    ...req.body,
    id: `v-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  vehicles.unshift(newVehicle);
  res.status(201).json({ success: true, vehicle: newVehicle });
});

// PUT /api/vehicles/:id (Admin update)
app.put('/api/vehicles/:id', (req, res) => {
  const idx = vehicles.findIndex((v) => v.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
  vehicles[idx] = {
    ...vehicles[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, vehicle: vehicles[idx] });
});

// DELETE /api/vehicles/:id
app.delete('/api/vehicles/:id', (req, res) => {
  vehicles = vehicles.filter((v) => v.id !== req.params.id);
  res.json({ success: true, message: 'Vehicle removed from fleet' });
});

// ==========================================
// 2. EVENT PACKAGES ROUTES
// ==========================================

// GET /api/packages
app.get('/api/packages', (req, res) => {
  const { eventType } = req.query;
  let result = [...packages];
  if (eventType && eventType !== 'all') {
    result = result.filter((p) => p.eventType.toLowerCase() === eventType.toLowerCase());
  }
  res.json({ success: true, count: result.length, packages: result });
});

// GET /api/packages/:id
app.get('/api/packages/:id', (req, res) => {
  const pkg = packages.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, error: 'Package not found' });
  }
  const interestedLeads = interests.filter((i) => i.packageId === pkg.id);
  res.json({ success: true, package: { ...pkg, interestedLeadsCount: interestedLeads.length, interestedLeads } });
});

// POST /api/packages
app.post('/api/packages', (req, res) => {
  const newPkg = {
    ...req.body,
    id: `pkg-${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  packages.unshift(newPkg);
  res.status(201).json({ success: true, package: newPkg });
});

// PUT /api/packages/:id
app.put('/api/packages/:id', (req, res) => {
  const idx = packages.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Package not found' });
  }
  packages[idx] = { ...packages[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, package: packages[idx] });
});

// DELETE /api/packages/:id
app.delete('/api/packages/:id', (req, res) => {
  packages = packages.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: 'Package removed' });
});

// ==========================================
// 3. INTEREST SUBMISSIONS & CRM PIPELINE
// ==========================================

// POST /api/interests (Customer submit interest form)
app.post('/api/interests', (req, res) => {
  // Honeypot spam protection
  if (req.body._honeypot || req.body.honeypot || req.body.website_source || req.body.user_anti_spam) {
    return res.status(400).json({ success: false, error: 'Spam detected' });
  }

  const { type, name, phone, email } = req.body;
  if (!name || !phone || !type) {
    return res.status(400).json({ success: false, error: 'Name, phone, and type are required' });
  }

  // Reference ID Generator: AT-V-XXXX for vehicle, AT-E-XXXX for event
  let refId = '';
  if (type === 'vehicle') {
    refId = `AT-V-${nextVehicleSeq}`;
    nextVehicleSeq += 1;
  } else {
    refId = `AT-E-${nextEventSeq}`;
    nextEventSeq += 1;
  }

  const newInterest = {
    id: `int-${Date.now()}`,
    refId,
    type,
    vehicleId: req.body.vehicleId,
    vehicleName: req.body.vehicleName,
    packageId: req.body.packageId,
    packageName: req.body.packageName,
    name,
    phone,
    email,
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
    followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  interests.unshift(newInterest);

  // Log initial activity
  activityLogs.unshift({
    id: `log-${Date.now()}`,
    interestId: newInterest.id,
    adminName: 'System Engine',
    action: 'Enquiry Received',
    notes: `Customer enquiry received for ${newInterest.vehicleName || newInterest.packageName}. Reference ID: ${refId}.`,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    refId,
    interest: newInterest,
    message: 'Your enquiry has been received. Our team will contact you shortly.',
  });
});

// GET /api/interests (Admin CRM view with filters and search)
app.get('/api/interests', (req, res) => {
  const { type, stage, status, search, vehicleId, packageId } = req.query;
  let result = [...interests];

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

// GET /api/interests/:id (Single submission with full CRM activity history)
app.get('/api/interests/:id', (req, res) => {
  const item = interests.find((i) => i.id === req.params.id || i.refId === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  const logs = activityLogs.filter((l) => l.interestId === item.id);
  res.json({ success: true, interest: item, activityLogs: logs });
});

// PUT /api/interests/:id (Admin update progress stage, notes, follow-up date)
app.put('/api/interests/:id', (req, res) => {
  const idx = interests.findIndex((i) => i.id === req.params.id || i.refId === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  const previousStage = interests[idx].progressStage;
  const { progressStage, internalNotes, followUpDate, status, adminName } = req.body;

  interests[idx] = {
    ...interests[idx],
    progressStage: progressStage || interests[idx].progressStage,
    internalNotes: internalNotes !== undefined ? internalNotes : interests[idx].internalNotes,
    followUpDate: followUpDate !== undefined ? followUpDate : interests[idx].followUpDate,
    status: status || (progressStage === 'Confirmed' ? 'Confirmed' : progressStage === 'Completed' ? 'Completed' : interests[idx].status),
    updatedAt: new Date().toISOString(),
  };

  // Add activity log entry
  if (progressStage && progressStage !== previousStage) {
    activityLogs.unshift({
      id: `log-${Date.now()}`,
      interestId: interests[idx].id,
      adminName: adminName || 'Amma Travels Staff',
      action: 'Stage Changed',
      notes: `Progress stage transitioned from '${previousStage}' to '${progressStage}'. ${internalNotes ? `Note: ${internalNotes}` : ''}`,
      createdAt: new Date().toISOString(),
    });
  } else if (internalNotes) {
    activityLogs.unshift({
      id: `log-${Date.now()}`,
      interestId: interests[idx].id,
      adminName: adminName || 'Amma Travels Staff',
      action: 'Note Logged',
      notes: internalNotes,
      createdAt: new Date().toISOString(),
    });
  }

  res.json({ success: true, interest: interests[idx] });
});

// ==========================================
// 4. PUBLIC ENQUIRY TRACKER
// ==========================================

// GET /api/track?refId=...&phone=...
app.get('/api/track', (req, res) => {
  const { refId, phone } = req.query;
  if (!refId || !phone) {
    return res.status(400).json({ success: false, error: 'Reference ID and Phone number are required' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  const found = interests.find(
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

  // Return public tracking view (timeline: Submitted -> Contacted -> Confirmed -> Completed)
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

app.get('/api/stats', (req, res) => {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;
  const bookedVehicles = vehicles.filter((v) => v.status === 'Booked').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'Maintenance').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const newEnquiriesToday = interests.filter((i) => i.createdAt.startsWith(todayStr)).length;
  const confirmedBookings = interests.filter((i) => i.progressStage === 'Confirmed').length;
  const eventEnquiries = interests.filter((i) => i.type === 'event').length;

  // Approximate revenue calculation
  const estimatedRevenue = interests
    .filter((i) => i.status === 'Confirmed' || i.status === 'Completed')
    .reduce((sum, i) => sum + (i.type === 'vehicle' ? 3500 : 75000), 0);

  // Grouped by day
  const enquiriesOverTime = [
    { date: 'Oct 23', count: 3 },
    { date: 'Oct 24', count: 5 },
    { date: 'Oct 25', count: 4 },
    { date: 'Oct 26', count: 8 },
    { date: 'Oct 27', count: 6 },
  ];

  const mostRequestedVehicles = [
    { name: 'Royal Enfield Classic 350', count: 18 },
    { name: 'Hyundai Creta SX', count: 14 },
    { name: 'Honda Activa 6G', count: 12 },
    { name: 'Maruti Suzuki Ertiga', count: 9 },
    { name: 'Mahindra Thar 4x4', count: 7 },
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
// 6. ADMIN AUTHENTICATION
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }

  // Pre-configured staff/admin authentication
  if (email.toLowerCase().includes('admin') || email === 'admin@ammatravelskkd.com') {
    return res.json({
      success: true,
      user: {
        id: 'u-admin-01',
        name: 'Amma Travels Admin',
        email: 'admin@ammatravelskkd.com',
        role: 'admin',
        token: 'jwt-token-admin-session',
      },
    });
  } else if (email.toLowerCase().includes('staff')) {
    return res.json({
      success: true,
      user: {
        id: 'u-staff-01',
        name: 'Operations Staff',
        email: 'staff@ammatravelskkd.com',
        role: 'staff',
        token: 'jwt-token-staff-session',
      },
    });
  }

  // Standard user login
  res.json({
    success: true,
    user: {
      id: 'u-cust-01',
      name: email.split('@')[0],
      email,
      role: 'user',
      token: 'jwt-token-user-session',
    },
  });
});

app.listen(PORT, () => {
  console.log(`[AmmaTravels Server] Express API running on port ${PORT}`);
});
