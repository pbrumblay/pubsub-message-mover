import fs from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import pino from 'pino';
import config from '#config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkgData = await fs.readFile(join(__dirname, '..', 'package.json'));
let pkg;
try {
  pkg = JSON.parse(pkgData.toString());
} catch {}

// https://cloud.google.com/logging/docs/structured-logging
// stack driver has problems with structured logging http requests
// - see: https://github.com/pinojs/pino-http/issues/216
const severityByPinoLevel = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const logger = pino({
  name: `${pkg.name}-logger`,
  messageKey: 'message',
  level: config.logLevel,
  formatters: {
    level(label, number) {
      return {
        severity: severityByPinoLevel[label] || severityByPinoLevel.info,
        level: number,
      };
    },
  },
});

export default logger;
