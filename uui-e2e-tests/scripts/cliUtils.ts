import { CLI_ARGS } from './constants';
// @ts-ignore
import spawn from 'cross-spawn';
import { Logger } from '../src/utils/logger';

export function readEnvParams() {
    const { UUI_IS_DOCKER, CI, UUI_DOCKER_HOST_MACHINE_IP, UUI_REPORT_OBSOLETE_SCREENSHOTS } = process.env;
    return {
        isDocker: UUI_IS_DOCKER === 'true',
        isCi: !!CI,
        UUI_DOCKER_HOST_MACHINE_IP,
        UUI_REPORT_OBSOLETE_SCREENSHOTS,
    };
}

export function hasCliArg(arg: typeof CLI_ARGS[keyof typeof CLI_ARGS]) {
    const args = getAllCliArgs();
    return args.indexOf(arg) !== -1;
}

export function spawnProcessSync(params: { cmd: string, args: string[], cwd: string }) {
    const { cwd, args, cmd } = params;
    const cmdInfoAsStr = `${cmd} ${args.join(' ')}`;

    Logger.info(cmdInfoAsStr);

    const result = spawn.sync(
        cmd,
        args,
        { stdio: 'inherit', cwd },
    );

    if (result.error) {
        Logger.error(`Failed to run: ${cmdInfoAsStr}: ${result.error.message}`);
    }
}

export function getAllCliArgs() {
    return [...process.argv.slice(2)];
}
