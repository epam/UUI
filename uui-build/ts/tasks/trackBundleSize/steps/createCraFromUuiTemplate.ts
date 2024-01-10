import fs from 'fs';
import path from 'path';
import { CLI, TEMPLATE_APP_TARGET_DIR } from '../constants';
import { uuiRoot } from '../../../constants';
import { runCmdFromRootSync } from '../../../utils/cliUtils';

const appTargetParentDirResolved = path.resolve(uuiRoot, TEMPLATE_APP_TARGET_DIR, '..');

export const createCraFromUuiTemplate = async () => {
    if (fs.existsSync(appTargetParentDirResolved)) {
        fs.rmSync(appTargetParentDirResolved, { recursive: true, force: true });
    }
    runCmdFromRootSync(CLI.createAppFromTemplate.cmd, CLI.createAppFromTemplate.args);
};
