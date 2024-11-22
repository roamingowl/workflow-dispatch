import { describe, it, expect, vi } from 'vitest';
import { context } from '@actions/github';
import { printSummary } from '../summary';
import { DEFAULT_JOB_SUMMARY_TEMPLATE } from '../templates/summary';

vi.spyOn(context, 'repo', 'get').mockReturnValue({ owner: 'me', repo: 'repo' });

describe('printSummary', () => {
  it('should print summary', async () => {
    const string = await printSummary('dummy.yaml', 'http://github.com/something', 'me/repo', true, true, DEFAULT_JOB_SUMMARY_TEMPLATE);
    expect(string).toBe('Workflow dummy.yaml has been triggered.  \n');
  });
});