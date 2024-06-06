import { logger } from '../../../utils/jsBridge';
import { readJsonFileSync } from '../../../utils/fileUtils';
import path from 'path';

type TBuildProgressParams = {
    moduleName: string,
    isRollup: boolean
};
class ModuleBuildProgressLogger {
    private startMs: number | undefined;

    constructor(public params: TBuildProgressParams) {}

    start() {
        this.initTimer();
        const notes = this.params.isRollup ? '(rollup)' : '(no index.tsx; will be published as-is)';
        logger.info(`${this.getMsgHeader()} ${notes}`);
    }

    done() {
        logger.success(`${this.getMsgHeader()} Done (${this.getTimerSinceStart()})`);
    }

    error() {
        logger.error(`${this.getMsgHeader()} Failed`);
    }

    private getMsgHeader() {
        return `Build "${this.params.moduleName}"`;
    }

    private initTimer() {
        this.startMs = Date.now();
    }

    private getTimerSinceStart(): string {
        const ms = Date.now() - this.startMs!;
        return `took ${Number(ms / 1000).toFixed(2)} sec`;
    }
}

export async function withEventsLogger(
    params: { moduleRootDir: string, isRollup: boolean, asyncCallback: () => Promise<void> },
) {
    const { asyncCallback, isRollup, moduleRootDir } = params;
    const moduleName = getModuleName(moduleRootDir);
    const moduleBuildLogger = new ModuleBuildProgressLogger({ moduleName, isRollup });
    moduleBuildLogger.start();
    try {
        await asyncCallback();
        moduleBuildLogger.done();
    } catch (err) {
        moduleBuildLogger.error();
        err && err.message && logger.error(err.message);
        process.exit(1);
    }
}

function getModuleName(moduleRootDir: string) {
    const res = readJsonFileSync(path.resolve(moduleRootDir, 'package.json'));
    if (res) {
        return `${res.name}@${res.version}`;
    }
    return moduleRootDir;
}
