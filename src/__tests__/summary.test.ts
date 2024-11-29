import { describe, it, expect, vi } from 'vitest';
import { context } from '@actions/github';
import * as core from '@actions/core';
import { printSummary } from '../summary';
import { DEFAULT_JOB_SUMMARY_TEMPLATE } from '../templates/summary';

vi.spyOn(context, 'repo', 'get').mockReturnValue({ owner: 'me', repo: 'repo' });

vi.mock('@actions/core', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@actions/core')>()),
    summary: { addRaw: vi.fn(() => {
      return { write: vi.fn() }}) },
  };
});

describe('printSummary', () => {
  it('should print summary', async () => {
    const setOutputMock = vi.spyOn(core, 'setOutput').mockImplementation(vi.fn());

    await printSummary('dummy.yaml', 'http://github.com/something', 'me/repo', true, true, DEFAULT_JOB_SUMMARY_TEMPLATE, 'success');
    expect(setOutputMock).toBeCalledWith('step-summary-markdown', `
You can follow the dispatched workflow dummy.yaml [here](http://github.com/something).  
  
✅ Workflow successful`);
  });
});