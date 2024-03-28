import { CLI_ARGS } from './constants';
import path from 'node:path';
// @ts-ignore
import spawn from 'cross-spawn';

export function readEnvParams() {
    const { UUI_IS_DOCKER, CI, UUI_APP_BASE_URL_FALLBACK } = process.env;
    return {
        isDocker: UUI_IS_DOCKER === 'true',
        isCi: !!CI,
        UUI_APP_BASE_URL_FALLBACK,
    };
}

export function hasCliArg(arg: typeof CLI_ARGS[keyof typeof CLI_ARGS]) {
    const args = getAllCliArgs();
    return args.indexOf(arg) !== -1;
}

export function getCwd(params: { isInsideMonorepo: boolean }) {
    const cwdCurrent = process.cwd();
    const { isInsideMonorepo } = params;
    if (isInsideMonorepo) {
        return path.resolve(cwdCurrent, '..');
    }
    return cwdCurrent;
}

export function spawnProcessSync(params: { cmd: string, args: string[], cwd: string }) {
    const { cwd, args, cmd } = params;

    // eslint-disable-next-line no-console
    console.info(`Running command (cwd = "${cwd}"): ${cmd} ${args.join(' ')}`);

    const result = spawn.sync(
        cmd,
        args,
        { stdio: 'inherit', cwd },
    );

    if (result.error) {
        console.error(`Failed to run ${cmd} ${args.join(' ')}: ${result.error.message}`);
    }
}

export function getAllCliArgs() {
    return [...process.argv.slice(2)];
}
