import { runYarnScriptFromRootSync } from '../../../utils/jsBridge';

export const buildAllModules = async () => {
    runYarnScriptFromRootSync('build-modules');
};
