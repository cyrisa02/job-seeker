// src/utils/logger.ts

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args); // ← console.log, pas logger.log
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
};
