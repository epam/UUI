import { runYarnScriptFromRootSync } from '../../../utils/cliUtils';

export const buildAllModules = async () => {
    runYarnScriptFromRootSync('build-modules');
};
