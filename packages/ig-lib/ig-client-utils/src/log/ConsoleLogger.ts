
import type { LoggerAdapter } from "@ig/lib";

export class ConsoleLogger implements LoggerAdapter {
  constructor(
    private silent = false,
  ) {}

  // Helper function to format the log prefix
  private getLogPrefix(level: string): string {
    const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format
    return `${timestamp} ${level}:`;
  }

  debug(...args: unknown[]): void {
    if (!this.silent) {
      console.debug(this.getLogPrefix("DBG"), ...args);
    }
  }

  log(...args: unknown[]): void {
    if (!this.silent) {
      console.log(this.getLogPrefix("LOG"), ...args);
    }
  }

  info(...args: unknown[]): void {
    if (!this.silent) {
      console.info(this.getLogPrefix("INF"), ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (!this.silent) {
      console.warn(this.getLogPrefix("WRN"), ...args);
    }
  }

  error(...args: unknown[]): void {
    if (!this.silent) {
      console.error(this.getLogPrefix("ERR"), ...args);
    }
  }
}
