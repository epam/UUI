// @ts-ignore
import fs from 'fs-extra';
import path from 'path';
import { FOLDERS } from '../constants';
import { withEventsLogger } from './buildProgressUtils';

/**
 * This is to handle modules which don't require build.
 * This function just copies all files to the output dir.
 */
export async function buildStaticModule(params: { moduleRootDir: string }) {
    const { moduleRootDir } = params;
    const asyncCallback = async () => {
        fs.emptyDirSync(FOLDERS.build);
        copyAllModuleFilesToOutputSync(moduleRootDir);
    };
    await withEventsLogger({ moduleRootDir, isRollup: false, asyncCallback });
}

/**
 * Copy everything to the output folder "as-is".
 */
function copyAllModuleFilesToOutputSync(moduleRootDir: string) {
    for (const file of fs.readdirSync(moduleRootDir)) {
        if ([FOLDERS.build, FOLDERS.node_modules].indexOf(file) === -1) {
            const from = path.resolve(moduleRootDir, file);
            const to = path.resolve(moduleRootDir, FOLDERS.build, file);
            fs.copySync(from, to);
        }
    }
}
