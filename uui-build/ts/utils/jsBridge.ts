/**
 * It's a temporary way to access JS utils from Typescript code (until we rewrite JS utils to TS).
 */

// Re-exports all JS utils

// @ts-ignore
export { logger } from '../../utils/loggerUtils';
// @ts-ignore
export { getAllMonorepoPackages, getAllLocalDependenciesInfo, getUuiVersion } from '../../utils/monorepoUtils';
// @ts-ignore
export { readPackageJsonContentSync } from '../../utils/packageJsonUtils';
// @ts-ignore
export { runYarnScriptFromRootSync, runCmdFromRootSync, runCmdSync } from '../../utils/cmdUtils';
// @ts-ignore
export { isRollupModule } from '../../utils/indexFileUtils';
