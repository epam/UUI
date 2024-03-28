import {
    getCwd,
    spawnProcessSync,
    readEnvParams, hasCliArg, getAllCliArgs,
} from '../cliUtils';
import { CLI_ARGS, NPX_TASKS } from '../constants';

const { isCi, isDocker } = readEnvParams();

runPlaywright();

function runPlaywright() {
    const isShowPwReport = hasCliArg(CLI_ARGS.SHOW_REPORT);

    if (isCi || isDocker) {
        if (isShowPwReport) {
            throwUnsupportedEnvErr();
        }
    } else {
        if (!isShowPwReport) {
            throwUnsupportedEnvErr();
        }
    }

    spawnProcessSync({
        cmd: 'npx',
        args: [NPX_TASKS.PLAYWRIGHT, ...getAllCliArgs()],
        cwd: getCwd({ isInsideMonorepo: !isDocker }),
    });
}

function throwUnsupportedEnvErr() {
    const SCRIPT_ERR = {
        UNSUPPORTED_ENV: '\nThis script is designed to run only in CI or Docker. Aborted. \n',
    };
    console.error(SCRIPT_ERR.UNSUPPORTED_ENV);
    process.exit(1);
}
