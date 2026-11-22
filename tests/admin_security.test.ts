import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { authenticate } from '../server/auth.js';

describe('Admin Panel Security & Discreet Access Verification', () => {
  const navbarContent = fs.readFileSync(path.resolve(__dirname, '../src/components/Navbar.tsx'), 'utf-8');
  const footerContent = fs.readFileSync(path.resolve(__dirname, '../src/components/Footer.tsx'), 'utf-8');
  const loginModalContent = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/AdminLoginModal.tsx'), 'utf-8');
  const appContent = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf-8');
  const authServerContent = fs.readFileSync(path.resolve(__dirname, '../server/auth.js'), 'utf-8');

  it('1. Navbar does not contain visible Admin or Admin Portal buttons', () => {
    // Should not have admin button in desktop nav
    expect(navbarContent).not.toContain('<span>Admin</span>');
    expect(navbarContent).not.toContain('<span>Admin Portal</span>');
    // Should not have admin login button in mobile drawer
    expect(navbarContent).not.toContain('Admin Portal Login');
  });

  it('2. Footer does not contain visible Admin Portal button', () => {
    expect(footerContent).not.toContain('<span>Admin Portal</span>');
    expect(footerContent).not.toContain('onClick={onOpenAdmin}');
  });

  it('3. Footer contains discreet multi-click trigger on copyright element', () => {
    expect(footerContent).toContain('handleSecretClick');
    expect(footerContent).toContain('onSecretAdminTrigger');
  });

  it('4. AdminLoginModal does not pre-fill or leak credentials', () => {
    // Inputs must start empty
    expect(loginModalContent).toContain("useState('')");
    expect(loginModalContent).not.toContain("useState('admin')");
    expect(loginModalContent).not.toContain("useState('AmmaAdmin#Kkd2026')");

    // Must not expose the credentials info pill or Fill Credentials button
    expect(loginModalContent).not.toContain('Fill Credentials');
    expect(loginModalContent).not.toContain('Admin Credentials');
  });

  it('5. AdminLoginModal implements brute-force lockout and bot honeypot protection', () => {
    // Lockout protection
    expect(loginModalContent).toContain('MAX_FAILED_ATTEMPTS');
    expect(loginModalContent).toContain('COOLDOWN_SECONDS');
    expect(loginModalContent).toContain('lockoutTimer');

    // Bot honeypot protection
    expect(loginModalContent).toContain('honeypot');
    expect(loginModalContent).toContain('sec_admin_ref');
  });

  it('6. App.tsx implements direct URL access (/admin and #admin) and Ctrl+Shift+A keyboard shortcut', () => {
    // URL detection
    expect(appContent).toContain('isAdminPath');
    expect(appContent).toContain("path === '/admin'");
    expect(appContent).toContain("hash === '#admin'");

    // Global keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A)
    expect(appContent).toContain("e.shiftKey && (e.key === 'A' || e.key === 'a')");
    expect(appContent).toContain('handleOpenAdminTrigger');
  });

  it('7. Server authentication returns generic error and never leaks password in error message', () => {
    // Verify server source does not disclose credentials in error string
    expect(authServerContent).not.toContain("Password: AmmaAdmin#Kkd2026");
    expect(authServerContent).toContain("Invalid administrator credentials");

    // Invalid login attempt
    const failedResult = authenticate('attacker', 'wrongpassword');
    expect(failedResult.success).toBe(false);
    expect(failedResult.error).toBe('Invalid administrator credentials. Please check your username and password.');
    expect(failedResult.error).not.toContain('Amma');
    expect(failedResult.error).not.toContain('Kkd');
  });

  it('8. Server authenticates authorized administrator with valid credentials', () => {
    const successResult = authenticate('admin', 'AmmaTravels@2026');
    expect(successResult.success).toBe(true);
    expect(successResult.user.role).toBe('admin');
    expect(successResult.token).toBeDefined();
  });
});
