import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AmmaTravels@2026';
const STAFF_USERNAME = process.env.STAFF_USERNAME || 'staff';
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'Staff@2026';
const JWT_SECRET = process.env.JWT_SECRET || 'at-kakinada-secret-key-2026';

export function createToken(user) {
  const payload = `${user.id}:${user.role}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 4) return null;
    const [id, role, timestamp, signature] = parts;
    const payload = `${id}:${role}:${timestamp}`;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (signature !== expectedSig) return null;

    // Check expiration (7 days)
    if (Date.now() - Number(timestamp) > 7 * 24 * 60 * 60 * 1000) return null;

    return { id, role };
  } catch {
    return null;
  }
}

export function authenticate(username, password) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (
    (cleanUser === ADMIN_USERNAME.toLowerCase() ||
      cleanUser === 'admin@ammatravelskkd.com' ||
      cleanUser === 'admin@ammatravels.in') &&
    cleanPass === ADMIN_PASSWORD
  ) {
    const user = {
      id: 'u-admin-01',
      name: 'Amma Travels Admin',
      email: 'admin@ammatravelskkd.com',
      role: 'admin',
    };
    return { success: true, user, token: createToken(user) };
  }

  if (
    (cleanUser === STAFF_USERNAME.toLowerCase() ||
      cleanUser === 'staff@ammatravelskkd.com' ||
      cleanUser === 'staff@ammatravels.in') &&
    cleanPass === STAFF_PASSWORD
  ) {
    const user = {
      id: 'u-staff-01',
      name: 'Operations Staff',
      email: 'staff@ammatravelskkd.com',
      role: 'staff',
    };
    return { success: true, user, token: createToken(user) };
  }

  return {
    success: false,
    error: 'Invalid username or password. Please use correct credentials.',
  };
}

export const requireAuth = (roles = ['admin', 'staff']) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Missing Bearer token.',
      });
    }
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid token. Please log in again.',
      });
    }
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permission denied. Insufficient administrative privileges.',
      });
    }
    req.user = user;
    next();
  };
};
