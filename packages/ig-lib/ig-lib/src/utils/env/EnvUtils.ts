
import { DAYS_TO_MS, HOURS_TO_MS, MIN_TO_MS, SEC_TO_MS } from '../time/TimeUtils';

export function getEnvVarStr(envVarName: string): string {
  const envVar: string | undefined = process.env[envVarName];
  if (!envVar) {
    throw new Error("Missing env var: " + envVarName);
  }
  return envVar;
}

export function getEnvVarStrAllowEmpty(envVarName: string): string | null {
  const envVar: string | undefined = process.env[envVarName];

  return envVar === undefined ? null : envVar;
}

export function getEnvVarBool(envVarName: string): boolean {
  const valueStr: string = getEnvVarStr(envVarName);
  return valueStr === "true";
}

export function getEnvVarInt(envVarName: string): number {
  const valueStr: string = getEnvVarStr(envVarName);
  const value: number = parseInt(valueStr);
  return value;
}

export function getEnvVarIntSecondsToMs(envVarName: string): number {
  const value: number = getEnvVarInt(envVarName);
  return SEC_TO_MS(value);
}

export function getEnvVarIntMinutesToMs(envVarName: string): number {
  const value: number = getEnvVarInt(envVarName);
  return MIN_TO_MS(value);
}

export function getEnvVarIntHoursToMs(envVarName: string): number {
  const value: number = getEnvVarInt(envVarName);
  return HOURS_TO_MS(value);
}

export function getEnvVarIntDaysToMs(envVarName: string): number {
  const value: number = getEnvVarInt(envVarName);
  return DAYS_TO_MS(value);
}
