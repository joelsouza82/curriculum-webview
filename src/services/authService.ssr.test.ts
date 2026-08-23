/**
 * @jest-environment node
 */
import { getSession } from './authService';

describe('authService on the server (no window)', () => {
  it('getSession returns null when window is undefined', () => {
    expect(getSession()).toBeNull();
  });
});
