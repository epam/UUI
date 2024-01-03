import { logger } from '../../../utils/jsBridge';

export type TSimpleWorkflowStep<P> = ((params: P) => Promise<void>) | (() => Promise<void>);

export function createSimpleWorkflow<P>(map: Record<string, TSimpleWorkflowStep<P>>) {
    async function run(params: P) {
        const mainTimer = getSimpleTimer('main');
        mainTimer.start();
        const keys = Object.keys(map);
        for (let i = 0; i < keys.length; i++) {
            logger.info('');
            const name = keys[i];
            const f = map[name];
            const timer = getSimpleTimer(name);
            timer.start();
            await f(params);
            timer.end();
        }
        mainTimer.end();
    }

    return { run };
}

function getSimpleTimer(name: string) {
    let start: Date;
    let end: Date;

    return {
        start: () => {
            start = new Date();
            logger.info(`Started "${name}".`);
        },

        end: () => {
            end = new Date();
            const sec = Math.ceil((end.getTime() - start.getTime()) / 1000);
            logger.success(`Completed "${name}". Took: ${sec} (sec).`);
        },

    };
}
