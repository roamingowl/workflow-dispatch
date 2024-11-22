import * as core from '@actions/core';
import prettyMs from 'pretty-ms';
import { getInputs, isTimedOut, sleep } from './utils';
import { WorkflowHandler, WorkflowRunConclusion, WorkflowRunResult, WorkflowRunStatus } from './workflow-handler';
import { handleWorkflowLogsPerJob } from './workflow-logs-handler';
import { TArgs } from './types';
import { printSummary } from './summary';

async function getFollowUrl(workflowHandler: WorkflowHandler, interval: number, timeout: number) {
  const start = Date.now();
  let url;
  do {
    await sleep(interval);
    try {
      const result = await workflowHandler.getWorkflowRunStatus();
      url = result.url;
    } catch (e) {
      core.debug(`Failed to get workflow url: ${(e as Error).message}`);
    }
  } while (!url && !isTimedOut(start, timeout));
  return url;
}

async function waitForCompletionOrTimeout(
  workflowHandler: WorkflowHandler,
  checkStatusInterval: number,
  waitForCompletionTimeout: number
) {
  const start = Date.now();
  let status;
  let result;
  do {
    await sleep(checkStatusInterval);
    try {
      result = await workflowHandler.getWorkflowRunStatus();
      status = result.status;
      core.debug(`Workflow is running for ${prettyMs(Date.now() - start)}. Current status: ${status}`);
    } catch (error) {
      core.warning(`Failed to get workflow status: ${(error as Error).message}`);
    }
  } while (status !== WorkflowRunStatus.COMPLETED && !isTimedOut(start, waitForCompletionTimeout));
  return { result, start };
}

function computeConclusion(start: number, waitForCompletionTimeout: number, result?: WorkflowRunResult) {
  if (isTimedOut(start, waitForCompletionTimeout)) {
    core.info('Workflow wait timed out');
    core.setOutput('workflow-conclusion', WorkflowRunConclusion.TIMED_OUT);
    throw new Error('Workflow run has failed due to timeout');
  }

  core.info(`Workflow completed with conclusion=${result?.conclusion}`);
  const conclusion = result?.conclusion;
  core.setOutput('workflow-conclusion', conclusion);

  if (conclusion === WorkflowRunConclusion.FAILURE) throw new Error('Workflow run has failed');
  if (conclusion === WorkflowRunConclusion.CANCELLED) throw new Error('Workflow run was cancelled');
  if (conclusion === WorkflowRunConclusion.TIMED_OUT) throw new Error('Workflow run has failed due to timeout');
}

async function handleLogs(args: TArgs, workflowHandler: WorkflowHandler) {
  try {
    const workflowRunId = await workflowHandler.getWorkflowRunId();
    await handleWorkflowLogsPerJob(args, workflowRunId);
  } catch (error) {
    core.error(`Failed to handle logs of triggered workflow. Cause: ${(error as Error).message}`);
  }
}

export async function run(): Promise<void> {
  try {
    const {
      token,
      workflowRef,
      owner,
      repo,
      ref,
      runName,
      workflowInputs,
      displayWorkflowUrl,
      workflowLogMode,
      waitForCompletionTimeout,
      checkStatusInterval,
      displayWorkflowUrlInterval,
      waitForCompletion,
      displayWorkflowUrlTimeout,
      printStepSummary,
      stepSummaryTemplate
    } = getInputs();

    const workflowHandler = new WorkflowHandler(token, workflowRef, owner, repo, ref, runName);

    await workflowHandler.triggerWorkflow(workflowInputs);
    core.info('Workflow triggered 🚀');

    let url: string | undefined = '';
    if (displayWorkflowUrl) {
      url = await getFollowUrl(workflowHandler, displayWorkflowUrlInterval, displayWorkflowUrlTimeout);
      core.info(`You can follow the running workflow here: ${url}`);
      core.setOutput('workflow-url', url);
    }

    if (!waitForCompletion) {
      if (printStepSummary) {
        await printSummary(runName, url, repo, waitForCompletion, displayWorkflowUrl, stepSummaryTemplate);
      }
      return;
    }

    core.info('Waiting for workflow completion');
    const { result, start } = await waitForCompletionOrTimeout(
      workflowHandler,
      checkStatusInterval,
      waitForCompletionTimeout
    );

    await handleLogs(
      {
        token,
        owner,
        repo,
        workflowLogMode
      },
      workflowHandler
    );

    core.setOutput('workflow-id', result?.id);
    core.setOutput('workflow-url', result?.url);

    computeConclusion(start, waitForCompletionTimeout, result);
    console.log('Print summary', printStepSummary);
    if (printStepSummary) {
      await printSummary(
        runName,
        url,
        repo,
        waitForCompletion,
        displayWorkflowUrl,
        stepSummaryTemplate,
        result?.conclusion
      );
    }
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}
