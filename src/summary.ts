import { Eta } from 'eta';
import * as core from '@actions/core';
import { context } from '@actions/github';

export async function printSummary(
  runName: string,
  url: string | undefined,
  repo: string,
  waitForCompletion: boolean,
  displayWorkflowUrl: boolean,
  stepSummaryTemplate: string,
  conclusion: string | undefined = undefined
) {
  const eta = new Eta();
  const templateData = {
    dispatchedWorkflow: { name: runName, url, repo: { name: repo }, conclusion },
    dispatchingWorkflow: { repo: { name: `${context.repo.owner}/${context.repo.repo}` } },
    waitForCompletion,
    displayWorkflowUrl
  };
  const summary = eta.renderString(stepSummaryTemplate, templateData);
  console.log(summary);
  await core.summary.addRaw(summary).write();
  core.setOutput('step-summary-markdown', summary);
}
