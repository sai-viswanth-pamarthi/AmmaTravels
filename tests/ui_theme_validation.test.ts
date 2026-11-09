import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('UI/UX System Verification', () => {
  const cssContent = fs.readFileSync(path.resolve(__dirname, '../src/index.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
  const appContent = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf-8');
  const modalContent = fs.readFileSync(path.resolve(__dirname, '../src/components/VehicleInterestModal.tsx'), 'utf-8');
  const navbarContent = fs.readFileSync(path.resolve(__dirname, '../src/components/Navbar.tsx'), 'utf-8');

  it('1. Dark/light theme CSS variables are defined for root and dark mode', () => {
    // Check root variables
    expect(cssContent).toContain('--background:');
    expect(cssContent).toContain('--text:');
    expect(cssContent).toContain('--primary:');
    expect(cssContent).toContain('--accent:');
    expect(cssContent).toContain('--card:');
    expect(cssContent).toContain('--border:');

    // Check dark class definitions
    expect(cssContent).toContain('.dark {');
    expect(cssContent).toContain('--background: #090d16;');
    expect(cssContent).toContain('--primary: #3b82f6;');
  });

  it('2. Theme transition duration is configured for smooth 200ms color changes', () => {
    expect(cssContent).toContain('transition-duration: 200ms;');
    expect(cssContent).toContain('transition-property: background-color, border-color, color, fill, stroke;');
  });

  it('3. App.tsx checks localStorage first, then system preference matchMedia fallback', () => {
    expect(appContent).toContain("localStorage.getItem('at_theme')");
    expect(appContent).toContain("window.matchMedia('(prefers-color-scheme: dark)').matches");
    expect(appContent).toContain("localStorage.setItem('at_theme'");
  });

  it('4. Navbar contains sun/moon toggle with aria-label and smooth transition', () => {
    expect(navbarContent).toContain('Sun');
    expect(navbarContent).toContain('Moon');
    expect(navbarContent).toContain('aria-label="Toggle dark mode"');
    expect(navbarContent).toContain('transition-all duration-200');
  });

  it('5. Navbar shrinks on scroll', () => {
    expect(navbarContent).toContain('scrolled');
    expect(navbarContent).toContain('py-2.5');
    expect(navbarContent).toContain('py-5');
  });

  it('6. Typography includes Inter for body and Poppins for headings with clamp() scales', () => {
    expect(indexHtml).toContain('family=Inter:wght@300;400;500;600;700');
    expect(indexHtml).toContain('family=Poppins:wght@500;600;700;800');
    expect(cssContent).toContain('--type-h1: clamp(');
    expect(cssContent).toContain('--type-h2: clamp(');
    expect(cssContent).toContain('--type-h3: clamp(');
    expect(cssContent).toContain('--type-body-base: clamp(');
  });

  it('7. Reduced motion preferences are respected', () => {
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(cssContent).toContain('animation-duration: 0.01ms !important');
  });

  it('8. Form validation contains inline errors for name, phone, pickup, return date', () => {
    expect(modalContent).toContain('validate(');
    expect(modalContent).toContain('fieldErrors.name');
    expect(modalContent).toContain('fieldErrors.phone');
    expect(modalContent).toContain('fieldErrors.pickupDate');
    expect(modalContent).toContain('fieldErrors.returnDate');
    expect(modalContent).toContain('aria-invalid');
  });

  it('9. Skeleton shimmer loading animation is defined', () => {
    expect(cssContent).toContain('.skeleton-shimmer');
    expect(cssContent).toContain('@keyframes shimmer');
  });

  it('10. Interactive micro-interactions for buttons and cards are defined', () => {
    expect(cssContent).toContain('.btn-interactive');
    expect(cssContent).toContain('.card-interactive');
  });
});
