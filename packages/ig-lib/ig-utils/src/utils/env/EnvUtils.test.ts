
import {
  getEnvVarBool,
  getEnvVarInt,
  getEnvVarIntDaysToMs,
  getEnvVarIntHoursToMs,
  getEnvVarIntMinutesToMs,
  getEnvVarIntSecondsToMs,
  getEnvVarStr,
  getEnvVarStrAllowEmpty,
} from './EnvUtils';

import { DAYS_TO_MS, HOURS_TO_MS, MIN_TO_MS, SEC_TO_MS } from '../time/TimeUtils';

describe('EnvUtils', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    // clone env so tests are isolated
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('getEnvVarStr', () => {
    it('returns env var value when present', () => {
      process.env.TEST_VAR = 'value';
      expect(getEnvVarStr('TEST_VAR')).toBe('value');
    });

    it('throws when env var is missing', () => {
      delete process.env.MISSING_VAR;
      expect(() => getEnvVarStr('MISSING_VAR')).toThrow(
        'Missing env var: MISSING_VAR'
      );
    });
  });

  describe('getEnvVarStrAllowEmpty', () => {
    it('returns value when present', () => {
      process.env.STR_VAR = 'abc';
      expect(getEnvVarStrAllowEmpty('STR_VAR')).toBe('abc');
    });

    it('returns empty string when env var is empty', () => {
      process.env.EMPTY_VAR = '';
      expect(getEnvVarStrAllowEmpty('EMPTY_VAR')).toBe('');
    });

    it('returns null when env var is undefined', () => {
      delete process.env.UNDEFINED_VAR;
      expect(getEnvVarStrAllowEmpty('UNDEFINED_VAR')).toBeNull();
    });
  });

  describe('getEnvVarBool', () => {
    it('returns true only when value is "true"', () => {
      process.env.FLAG = 'true';
      expect(getEnvVarBool('FLAG')).toBe(true);

      process.env.FLAG = 'false';
      expect(getEnvVarBool('FLAG')).toBe(false);

      process.env.FLAG = 'anything-else';
      expect(getEnvVarBool('FLAG')).toBe(false);
    });
  });

  describe('getEnvVarInt', () => {
    it('parses integer value', () => {
      process.env.NUM = '42';
      expect(getEnvVarInt('NUM')).toBe(42);
    });
  });

  describe('time conversion helpers', () => {
    it('converts seconds to ms', () => {
      process.env.SECONDS = '5';
      expect(getEnvVarIntSecondsToMs('SECONDS')).toBe(SEC_TO_MS(5));
    });

    it('converts minutes to ms', () => {
      process.env.MINUTES = '2';
      expect(getEnvVarIntMinutesToMs('MINUTES')).toBe(MIN_TO_MS(2));
    });

    it('converts hours to ms', () => {
      process.env.HOURS = '3';
      expect(getEnvVarIntHoursToMs('HOURS')).toBe(HOURS_TO_MS(3));
    });

    it('converts days to ms', () => {
      process.env.DAYS = '1';
      expect(getEnvVarIntDaysToMs('DAYS')).toBe(DAYS_TO_MS(1));
    });
  });
});
