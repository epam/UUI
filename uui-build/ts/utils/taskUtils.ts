import { parseCliArgs, TCliArgConfig, TCliArgParsed } from './cliUtils';
import { logger } from './jsBridge';

export type TTaskParams = {
    cliArgs: Record<string, TCliArgParsed>
};
export interface ITaskConfig {
    main: ((params: TTaskParams) => Promise<void>) | (() => Promise<void>);
    cliArgs?: TCliArgConfig;
}
export async function runTask(selectedTask: ITaskConfig) {
    const cliArgsArr = parseCliArgs(selectedTask.cliArgs);
    const cliArgs = cliArgsArr.reduce<TTaskParams['cliArgs']>((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {});
    try {
        await selectedTask.main({ cliArgs });
    } catch (err) {
        logger.error(err);
        throw err;
    }
}
