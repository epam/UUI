import { Logger } from '../../framework/utils/logger';

const msg = process.argv[2];
Logger.error(msg);

process.exit(1);
