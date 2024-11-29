import { describe, it, expect, vi } from 'vitest';
import * as core from '@actions/core';
import { run } from '../main';

vi.spyOn(core, 'setFailed').mockImplementation(vi.fn());

describe('Main', () => {
  //TODO: Add tests
  it('should work', async () => {
    expect(true).toBe(true);
  });
  it('handleLogs', async () => {
    await run();
    expect(true).toBe(true);
  });
});