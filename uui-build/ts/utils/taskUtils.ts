import { parseCliArgs, TCliArgConfig, TCliArgParsed } from './cliUtils';
import { logger } from './jsBridge';

export type TTaskParams = {
    cliArgs: TCliArgParsed[]
};
export interface ITaskConfig {
    main: ((params: TTaskParams) => Promise<void>) | (() => Promise<void>);
    cliArgs?: TCliArgConfig;
}
export async function runTask(selectedTask: ITaskConfig) {
    const cliArgs = parseCliArgs(selectedTask.cliArgs);
    try {
        await selectedTask.main({ cliArgs });
    } catch (err) {
        logger.error(err);
        throw err;
    }
}
