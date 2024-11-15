import { describe, it, expect } from 'vitest';
import { run } from '../main';

describe('Main', () => {
  it('should work', async () => {
    expect(true).toBe(true);
  });
  it('handleLogs', async () => {
    await run();
    expect(true).toBe(true);
  });
});