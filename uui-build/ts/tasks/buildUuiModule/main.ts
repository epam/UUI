import { ITaskConfig } from '../../utils/taskUtils';
import { isRollupModule } from '../../utils/jsBridge';
import { buildModuleUsingRollup } from './utils/buildRollup';
import { buildStaticModule } from './utils/buildStatic';

export const taskConfig: ITaskConfig = {
    main,
};

/**
 * Builds UUI module. This task is UUI-specific.
 * @returns {Promise<void>}
 */
async function main() {
    const moduleRootDir = process.cwd();
    const isRollup = isRollupModule(moduleRootDir);
    if (isRollup) {
        await buildModuleUsingRollup({
            moduleRootDir,
            copyAsIs: ['readme.md', 'assets'],
            packageJsonTransform: (content) => {
                return Object.keys(content).reduce<Record<string, unknown>>((acc, key) => {
                    if (key === 'epam:uui:main') {
                        // delete
                        return acc;
                    }
                    if (key === 'main') {
                        // "module" is read by major bundlers: Rollup, Webpack, etc.
                        acc.module = 'index.esm.js';
                    }
                    acc[key] = content[key];
                    return acc;
                }, {});
            },
        });
    } else {
        await buildStaticModule({ moduleRootDir });
    }
}
