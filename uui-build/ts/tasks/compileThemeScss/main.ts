import path from 'path';
import fs from 'fs';
import { compileScssDir } from './scssUtils';
import { ITaskConfig, TTaskParams } from '../../utils/taskUtils';
import { TCliArgParsed } from '../../utils/cliUtils';
import { uuiRoot } from '../../constants';

enum ARGS {
    RECURSIVE = '--recursive',
    DIRS = '--dirs'
}
export const taskConfig: ITaskConfig = {
    main,
    cliArgs: {
        [ARGS.RECURSIVE]: { format: 'Name' },
        [ARGS.DIRS]: { format: 'NameValue', required: true },
    },
};

/**
 * Compiles scss within the specified directory and copies the result to another specified directory.
 *
 * Argument "--dirs" is supported. Directory path is relative to CWD. E.g.:
 *      --dirs=<src_dir_1>:<target_dir_1>
 *      --dirs=<src_dir_1>:<target_dir_1>,<src_dir_2>:<target_dir_2>
 *      --dirs=./epam-assets/theme:./epam-assets/build/css/theme
 * @returns {Promise<void>}
 */
async function main(params: TTaskParams) {
    const recursive = !!params.cliArgs[ARGS.RECURSIVE];
    const dirsParsed = parseDirsCliArg(params.cliArgs[ARGS.DIRS] as TCliArgParsed);
    function filter(filePath: string) {
        return filePath.endsWith('.scss') && filePath.indexOf('build') === -1;
    }
    await Promise.all(
        dirsParsed.map(({ from, to }) => compileScssDir({ from, to, filter, recursive })),
    );
}

function parseDirsCliArg(dirsArg: TCliArgParsed): { from: string, to: string }[] {
    const allSrc = dirsArg.value?.split(',').map((pair) => pair.split(':')) as ([string, string])[];
    const dirs = [];
    for (let i = 0; i < allSrc.length; i++) {
        const item = allSrc[i];
        const from = path.resolve(uuiRoot, item[0]);
        const to = path.resolve(uuiRoot, item[1]);
        if (!fs.existsSync(from)) {
            throw new Error(`Can't find ${from}`);
        }
        if (fs.lstatSync(from).isFile()) {
            throw new Error(`Folder is expected ${from}`);
        } else {
            dirs.push({
                from,
                to,
            });
        }
    }
    return dirs;
}
