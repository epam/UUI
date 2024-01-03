import path from 'path';
import SourceMapExplorer from 'source-map-explorer';
import { TBundleSize } from '../types';
import { ExploreResult } from 'source-map-explorer/lib/types';
import { uuiRoot } from '../../../constants';

export async function getBundleSizeByRelGlob(relativeGlob: { css: string, js: string }): Promise<TBundleSize> {
    const absGlob = {
        css: path.resolve(uuiRoot, relativeGlob.css),
        js: path.resolve(uuiRoot, relativeGlob.js),
    };
    return await getBundleSizeByAbsGlob(absGlob);
}
export async function getBundleSizeByAbsGlob(absoluteGlob: { css: string, js: string }): Promise<TBundleSize> {
    const [css, js] = await Promise.all([
        getSingleSizeByAbsGlob(absoluteGlob.css),
        getSingleSizeByAbsGlob(absoluteGlob.js),
    ]);
    return { css, js };
}
async function getSingleSizeByAbsGlob(absGlob: string): Promise<number> {
    const result = await explore(absGlob);
    return result.bundles.reduce((acc, { totalBytes }) => {
        return acc + totalBytes;
    }, 0);
}

async function explore(absGlob: string) {
    try {
        return await SourceMapExplorer(absGlob, { output: { format: 'json' }, noBorderChecks: true, gzip: false });
    } catch (err: any) {
        if (err.bundles?.length === 0 && err.errors?.length === 1 && err.errors[0].code === 'ENOENT') {
            return err as ExploreResult;
        } else {
            console.error(err);
            console.error('Unable to measure size of: ' + absGlob);
            throw new Error(err);
        }
    }
}
