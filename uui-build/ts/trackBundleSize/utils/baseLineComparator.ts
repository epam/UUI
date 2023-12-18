import { COMPARISON_THRESHOLD_PERCENTAGE } from '../constants';
import { TBundleSize, TBundleSizeBaseLine, TComparisonRes } from '../types';

/**
 * It expects all sizes specified in bytes, but the Markdown output will be generated in kBytes (for readability).
 */
export function compareBaseLines(params: { currentBaseLine: TBundleSizeBaseLine | undefined, newBaseLine: TBundleSizeBaseLine }): TComparisonRes {
    const { currentBaseLine, newBaseLine } = params;
    return Object.keys(newBaseLine.sizes).reduce<TComparisonRes>((acc, name) => {
        const size = newBaseLine.sizes[name];
        const sizeTotal = size.js + size.css;
        /**
         * We use 0 as a baseline for any new packages without previous baseline
         */
        const baseLineSize: TBundleSize = currentBaseLine?.sizes[name] || { css: 0, js: 0 };
        const threshold = getThreshold(baseLineSize);
        const diff = getDiff(baseLineSize, size);
        const diffSeparated = getDiffSeparated(baseLineSize, size);
        const withinThreshold = sizeTotal >= threshold[0] && sizeTotal <= threshold[1];

        const diffDetails = getDiffDetailsMd(diffSeparated);
        acc[name] = {
            baseLineSize: bytesToKbSeparated(baseLineSize),
            size: bytesToKbSeparated(size),
            diffLabel: `${getSign(diff)}${bytesToKb(diff)}<br />${diffDetails}`,
            withinThreshold,
            thresholdLabel: `${bytesToKb(threshold[0])} - ${bytesToKb(threshold[1])}`,
        };
        return acc;
    }, {});
}

function getDiffDetailsMd(params:{ js: number, css: number }) {
    const js = `${getSign(params.js)}${bytesToKb(params.js)}`;
    const css = `${getSign(params.css)}${bytesToKb(params.css)}`;
    const fence = '```';
    return `${fence} js:${js}${fence}<br />${fence}css:${css} ${fence}`;
}

function getSign(diff: number) {
    return diff > 0 ? '+' : '';
}

function normalizeSizeNumber(num: number) {
    return Number(Number(num).toFixed(2));
}
function bytesToKbSeparated(bytes: TBundleSize) {
    return {
        js: bytesToKb(bytes.js),
        css: bytesToKb(bytes.css),
    };
}

function bytesToKb(bytes: number) {
    return normalizeSizeNumber(bytes / 1024);
}

function getThreshold(size: TBundleSize) {
    const total = size.css + size.js;
    const pcNorm = COMPARISON_THRESHOLD_PERCENTAGE / 100;
    return [Math.floor(total * (1 - pcNorm)), Math.ceil(total * (1 + pcNorm))];
}

function getDiff(prevSize: TBundleSize, nextSize: TBundleSize) {
    return (nextSize.js + nextSize.css) - (prevSize.js + prevSize.css);
}
function getDiffSeparated(prevSize: TBundleSize, nextSize: TBundleSize): TBundleSize {
    return {
        js: nextSize.js - prevSize.js,
        css: nextSize.css - prevSize.css,
    };
}
