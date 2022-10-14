import process from 'node:process';
import {Command} from 'commander';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {moveMessages} from '#src/move-messages';

const program = new Command();

/* eslint-disable prettier/prettier */
program
  .requiredOption('-s, --sourcesubscription <sub name>', 'Source subscription to pull messages from.')
  .requiredOption('-t, --targettopic <topic name>', 'Target topic to move messages to.')
  .requiredOption('-sp, --subproject <project>', 'Name of project where subscription is defined.')
  .requiredOption('-tp, --topicproject <project>', 'Name of project where topic is defined.')
  .option('-n, --nummessages <number>', 'Number of messages to move at a time.', 100)
  .option('-tm, --total <number>', 'Total number of messages to move. This real sum of the moved messages be a maximum of total + nummessages.', 100);
/* eslint-enable prettier/prettier */

program.parse(process.argv);
const options = program.opts();

await moveMessages(options);
