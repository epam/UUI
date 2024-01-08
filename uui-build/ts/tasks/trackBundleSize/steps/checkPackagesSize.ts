/* eslint-disable no-console */
import { getBundleSizeByAbsGlob, getBundleSizeByRelGlob } from '../utils/bundleSizeUtils';
import {
    baseLineToString,
    createBaseLine,
    getCurrentBaseLineSync,
    overrideBaseLineFileSync,
    saveComparisonResultsMd,
} from '../utils/baseLineUtils';
import { compareBaseLines } from '../utils/baseLineComparator';
import { convertComparisonResultToMd } from '../utils/mdFormatter';
import { TBundleSizeMap, TTrackBsParams } from '../types';
import { APP_TARGET_DIR, COLLECT_SIZE_GLOB, TEMPLATE_APP_TARGET_DIR, UNTRACKED_MODULES } from '../constants';
import { getAllMonorepoPackages, isRollupModule } from '../../../utils/jsBridge';

export const checkPackagesSize = async (params: TTrackBsParams) => {
    const { overrideBaseline } = params || {};
    const newSizes = await getSizeOfAllPackages();
    console.log('New sizes:');
    console.table(newSizes);
    const newBaseLine = createBaseLine(newSizes);
    if (overrideBaseline) {
        const newBaseLineStr = baseLineToString(newBaseLine);
        overrideBaseLineFileSync(newBaseLineStr);
    }
    const currentBaseLine = getCurrentBaseLineSync();
    if (currentBaseLine) {
        const baseLineSizes = currentBaseLine.sizes;
        console.log('Baseline sizes:');
        console.table(baseLineSizes);
    } else {
        console.log('Baseline sizes: not found');
    }

    const comparisonResult = compareBaseLines({ currentBaseLine, newBaseLine });
    const comparisonResultMd = convertComparisonResultToMd({ currentBaseLine, newBaseLine, comparisonResult });
    console.log('Comparison results:');
    console.table(comparisonResult);
    saveComparisonResultsMd(comparisonResultMd);
};

export async function getSizeOfAllPackages(): Promise<TBundleSizeMap> {
    const appSize = await getBundleSizeByRelGlob({
        js: `${APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP.JS}`,
        css: `${APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP.CSS}`,
    });
    const templateAppSize = await getBundleSizeByRelGlob({
        js: `${TEMPLATE_APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP.JS}`,
        css: `${TEMPLATE_APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP.CSS}`,
    });
    const allLocalPackages = getAllMonorepoPackages();

    const promiseArr = Object.keys(allLocalPackages)
        .filter((name) => {
            return isRollupModule(allLocalPackages[name].moduleRootDir) && UNTRACKED_MODULES.indexOf(name) === -1;
        })
        .map(async (name) => {
            const dir = allLocalPackages[name].moduleRootDir;
            const size = await getBundleSizeByAbsGlob({
                js: `${dir}/${COLLECT_SIZE_GLOB.MODULE.JS}`,
                css: `${dir}/${COLLECT_SIZE_GLOB.MODULE.CSS}`,
            });
            return { name, size };
        });

    const moduleBundleSizes = await Promise.all(promiseArr);
    const moduleBundleSizesMap = moduleBundleSizes.reduce<TBundleSizeMap>((acc, { name, size }) => {
        acc[name] = size;
        return acc;
    }, {});

    return {
        templateApp: templateAppSize,
        '@epam/app': appSize,
        ...moduleBundleSizesMap,
    };
}
