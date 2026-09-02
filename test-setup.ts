// Vitest global test setup. Tracked so a clean checkout (CI) has it.
// `/vitest` registers the jest-dom matchers at runtime AND augments vitest's
// `expect` types so `tsc --noEmit` recognizes toBeInTheDocument/toHaveValue/etc.
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
