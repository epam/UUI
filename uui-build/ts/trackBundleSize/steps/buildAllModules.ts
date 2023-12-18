import { runYarnScriptFromRootSync } from '../../jsBridge';

export const buildAllModules = async () => {
    runYarnScriptFromRootSync('build-modules');
};
