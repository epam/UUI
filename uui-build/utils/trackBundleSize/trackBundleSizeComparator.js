const { COMPARISON_THRESHOLD_PERCENTAGE } = require('./bundleStatsConstants');

module.exports = { compareBundleSizes };

function normalizeSizeNumber(num) {
    return Number(Number(num).toFixed(2));
}
function bytesToKb(bytes) {
    return normalizeSizeNumber(bytes / 1024);
}

function getThreshold(baseLineSize) {
    const pcNorm = COMPARISON_THRESHOLD_PERCENTAGE / 100;
    return [Math.floor(baseLineSize * (1 - pcNorm)), Math.ceil(baseLineSize * (1 + pcNorm))];
}

/**
 * It expects all sizes specified in bytes, but the output will be generated in kBytes (for readability).
 * @param baseLineSizes
 * @param newSizes
 */
function compareBundleSizes({ baseLineSizes, newSizes }) {
    return Object.keys(newSizes).reduce((acc, name) => {
        const size = newSizes[name];
        /**
         * We use 0 as a baseline for any new packages without previous baseline
         */
        const baseLineSize = baseLineSizes[name] || 0;
        const threshold = getThreshold(baseLineSize);
        const diff = size - baseLineSize;
        const sign = diff > 0 ? '+' : '';
        const withinThreshold = size >= threshold[0] && size <= threshold[1];

        acc[name] = {
            baseLineSize: bytesToKb(baseLineSize),
            size: bytesToKb(size),
            diffLabel: `${sign}${bytesToKb(diff)}`,
            withinThreshold,
            thresholdLabel: `${bytesToKb(threshold[0])} - ${bytesToKb(threshold[1])}`,
        };
        return acc;
    }, {});
}
