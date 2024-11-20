import * as core from '@actions/core';
import * as github from '@actions/github';
import YAML from 'yaml';

enum TimeUnit {
  S = 1000,
  M = 60 * 1000,
  H = 60 * 60 * 1000
}

function toMilliseconds(timeWithUnit: string): number {
  const unitStr = timeWithUnit.substring(timeWithUnit.length - 1);
  const unit = TimeUnit[unitStr.toUpperCase() as keyof typeof TimeUnit];
  if (!unit) {
    throw new Error('Unknown time unit ' + unitStr);
  }
  const time = parseFloat(timeWithUnit);
  return time * unit;
}

export function parseWorkflowInputs(inputsJsonOrYaml: string) {
  if (inputsJsonOrYaml === '') {
    core.debug('No inputs provided');
    return {};
  }
  let parsedInputs: unknown | {meta: unknown} = undefined;

  core.debug('Parsing inputs as JSON');
  try {
    parsedInputs = JSON.parse(inputsJsonOrYaml);
    if (typeof parsedInputs === 'object') {
      core.debug('Inputs parsed as JSON');
      return parsedInputs;
    }
  } catch (error) {
    core.debug(`Failed to parse inputs as JSON: ${(error as Error).message}`);
  }

  core.debug('Parsing inputs as YAML');
  parsedInputs = YAML.parse(inputsJsonOrYaml);
  if (typeof parsedInputs !== 'object') {
    const error = new TypeError('Parsed inputs are not an object');
    core.setFailed(error);
    throw error;
  }
  core.debug('Inputs parsed as YAML');
  // @ts-ignore
  if (parsedInputs?.meta) {
    // @ts-ignore
    parsedInputs.meta = JSON.stringify(parsedInputs.meta);
  }
  return parsedInputs;
}
export function getInputs() {
  const token = core.getInput('token', { required: true });
  const workflowRef = core.getInput('workflow', { required: true });

  const ref = core.getInput('ref') || github.context.ref;
  const [owner, repo] = core.getInput('repo')
    ? core.getInput('repo').split('/')
    : [github.context.repo.owner, github.context.repo.repo];

  // Decode inputs, this MUST be a valid JSON string
  const inputs = parseWorkflowInputs(core.getInput('inputs'));

  const displayWorkflowUrlStr = core.getInput('display-workflow-run-url');
  const displayWorkflowUrl = displayWorkflowUrlStr && displayWorkflowUrlStr === 'true';
  const displayWorkflowUrlTimeout = toMilliseconds(core.getInput('display-workflow-run-url-timeout'));
  const displayWorkflowUrlInterval = toMilliseconds(core.getInput('display-workflow-run-url-interval'));

  const waitForCompletionStr = core.getInput('wait-for-completion');
  const waitForCompletion = waitForCompletionStr && waitForCompletionStr === 'true';
  const waitForCompletionTimeout = toMilliseconds(core.getInput('wait-for-completion-timeout'));
  const checkStatusInterval = toMilliseconds(core.getInput('wait-for-completion-interval'));
  const runName = core.getInput('run-name');
  const workflowLogMode = core.getInput('workflow-logs');

  return {
    token,
    workflowRef,
    ref,
    owner,
    repo,
    workflowInputs: inputs as { [key: string]: unknown },
    displayWorkflowUrl,
    displayWorkflowUrlTimeout,
    displayWorkflowUrlInterval,
    checkStatusInterval,
    waitForCompletion,
    waitForCompletionTimeout,
    runName,
    workflowLogMode
  };
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isTimedOut(start: number, waitForCompletionTimeout: number) {
  return Date.now() > start + waitForCompletionTimeout;
}
