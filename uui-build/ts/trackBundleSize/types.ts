export type TBundleSizeBaseLine = {
    version: string,
    timestamp: string,
    sizes: TBundleSizeMap
};

export type TBundleSizeMap = {
    [moduleName: string]: TBundleSize
};

export type TBundleSize = {
    js: number,
    css: number,
};

export type TComparisonResLine = {
    baseLineSize: TBundleSize
    size: TBundleSize
    diffLabel: string
    withinThreshold: boolean
    thresholdLabel: string
};
export type TComparisonRes = {
    [moduleName: string]: TComparisonResLine
};

export type TTrackBsParams = {
    overrideBaseline: boolean
};
