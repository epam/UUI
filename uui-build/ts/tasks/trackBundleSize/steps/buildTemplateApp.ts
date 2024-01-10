import { appTargetDirResolved, CLI } from '../constants';
import { runCmdSync } from '../../../utils/cliUtils';

export const buildTemplateApp = async () => {
    const cmd = CLI.buildApp.cmd;
    const args = CLI.buildApp.args;
    const cwd = appTargetDirResolved;
    runCmdSync({ cmd, cwd, args });
};
