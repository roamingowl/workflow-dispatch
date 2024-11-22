import { describe, it, expect, vi } from 'vitest';
import * as core from '@actions/core';
import { parseWorkflowInputs } from '../utils';

describe('parseWorkflowInputs', () => {
  it('should parse JSON string', () => {
    expect(parseWorkflowInputs(`{"key1": "value1", "key2": 2, "key3": false, "key4": null}`)).toEqual({
      key1: 'value1',
      key2: 2,
      key3: false,
      key4: null
    });
  });

  it('should parse YAML string', () => {
    expect(
      parseWorkflowInputs(`key1: "value1"
key2: 2
key3: false
key4: null
key5: |-
  line1
  line2
`)
    ).toEqual({
      key1: 'value1',
      key2: 2,
      key3: false,
      key4: null,
      key5: `line1
line2`
    });
  });

  it('should return empty object if input is empty', () => {
    expect(parseWorkflowInputs('')).toEqual({});
  });

  it('should fail if input is not a valid JSON or YAML', () => {
    vi.spyOn(core, 'setFailed').mockImplementation(vi.fn());

    expect(() => parseWorkflowInputs('{"ssasa":invalid{{{{"s":}{')).toThrowError();
    expect(() => parseWorkflowInputs('hello')).toThrowError();
    expect(() => parseWorkflowInputs('1234')).toThrowError();
    expect(() => parseWorkflowInputs(`>key1: value1:vaule2`)).toThrowError();
  });
});
