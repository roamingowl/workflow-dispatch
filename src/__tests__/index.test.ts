import { vi, describe, it, expect } from 'vitest';
import * as core from '@actions/core';
import * as main from '../main';

const runMock = vi.spyOn(main, 'run').mockImplementation(vi.fn());

vi.spyOn(core, 'setFailed').mockImplementation(vi.fn());
vi.spyOn(core, 'error').mockImplementation(vi.fn());


describe('index', () => {
  it('calls run when imported', async () => {
    await import('../index');
    expect(runMock).toHaveBeenCalled();
  });
});
