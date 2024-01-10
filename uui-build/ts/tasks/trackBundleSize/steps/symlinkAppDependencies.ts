import path from 'path';
import {
    getAllLocalDependenciesInfo,
    getAllMonorepoPackages,
    logger,
} from '../../../utils/jsBridge';
import { appTargetDirResolved, epamPrefix } from '../constants';
import { runCmdSync } from '../../../utils/cliUtils';
import { readJsonFileSync } from '../../../utils/fileUtils';

export const symlinkAppDependencies = async () => {
    // 1. get list of dependencies which can be symlinked to local folders
    const { dependencies, devDependencies } = readJsonFileSync(path.resolve(appTargetDirResolved, 'package.json'));
    const potentiallyLocalDeps = Object.keys({ ...dependencies, ...devDependencies }).filter((n) => n.indexOf(epamPrefix) === 0);

    // 2. check whether we have any local dependencies with same names and symlink them if so.
    const allLocalPackages = getAllMonorepoPackages();
    const localDepsToBeSymlinkedMap = potentiallyLocalDeps
        .reduce<Record<string, { name: string, moduleRootDir: string }>>(
        (acc, name) => {
            const loc = allLocalPackages[name];
            if (loc) {
                acc[name] = loc;

                // also, need to add local deps of this local dep. otherwise - it will take it from NPM, which is unexpected.
                const allDepsIncludingTransitive: { name: string }[] = getAllLocalDependenciesInfo(name);
                allDepsIncludingTransitive.forEach((dt) => {
                    acc[dt.name] = allLocalPackages[dt.name];
                });
            }
            return acc;
        },
        {},
    );

    // 3. create actual symlinks
    Object.values(localDepsToBeSymlinkedMap).forEach(({ name, moduleRootDir }) => {
        const dirName = path.resolve(moduleRootDir, './build');
        const cmd = 'npm';
        const cwd = appTargetDirResolved;
        runCmdSync({
            cmd,
            cwd,
            args: [
                'link', dirName, '--save',
            ],
        });
        logger.info(`Symlink created for "${name}".`);
    });
};
