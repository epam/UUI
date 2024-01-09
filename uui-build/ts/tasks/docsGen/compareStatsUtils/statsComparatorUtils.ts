import { TDocGenStatsResult } from '../types/types';
import { formatResultsToMd } from './statsMdFormatterUtils';
import { getStatsFromFile, removeComparisonReportMd, saveComparisonReportMd } from './statsLoaderUtils';
import { TCompareStatsResult } from './types';

export function compareToPrevStats(nextStats: TDocGenStatsResult, relPath: string | undefined) {
    removeComparisonReportMd();
    if (relPath) {
        const prevStats = getStatsFromFile(relPath);
        const comparisonResult = compareStats({ prevStats, nextStats });
        const mdReport = formatResultsToMd(comparisonResult);
        saveComparisonReportMd(mdReport);
    }
}

function compareStats(params: { prevStats: TDocGenStatsResult | undefined, nextStats: TDocGenStatsResult }): TCompareStatsResult {
    const { prevStats, nextStats } = params;

    const propsNoComment = {
        prev: prevStats ? prevStats.missingPropComment.totals.amountProps : undefined,
        next: nextStats.missingPropComment.totals.amountProps,
    };
    const typesNoComment = {
        prev: prevStats ? prevStats.missingTypeComment.totals.amountTypes : undefined,
        next: nextStats.missingTypeComment.totals.amountTypes,
    };
    return {
        propsNoComment: {
            ...propsNoComment,
            isIncreased: isIncreased(propsNoComment.prev, propsNoComment.next),
            newWithNoComment: getNewPropsWithNoComments(params),
        },
        typesNoComment: {
            ...typesNoComment,
            isIncreased: isIncreased(typesNoComment.prev, typesNoComment.next),
            newWithNoComment: getNewTypesWithNoComments(params),
        },
    };

    function isIncreased(prevAmount: number | undefined, nextAmount: number) {
        if (prevAmount === undefined) {
            return false;
        }
        return nextAmount > prevAmount;
    }
}

function getNewTypesWithNoComments(params: { prevStats: TDocGenStatsResult | undefined, nextStats: TDocGenStatsResult }): string[] {
    const res: string[] = [];
    const { prevStats, nextStats } = params;
    const prevSet = new Set(prevStats?.missingTypeComment.value || []);
    nextStats.missingTypeComment.value.forEach((typeRef) => {
        if (!prevSet.has(typeRef)) {
            res.push(typeRef);
        }
    });
    return res;
}

function getNewPropsWithNoComments(params: { prevStats: TDocGenStatsResult | undefined, nextStats: TDocGenStatsResult }): string[] {
    const res: string[] = [];
    const { prevStats, nextStats } = params;
    const prevSet = new Set(normMissingPropComments(prevStats));
    const nextArr = normMissingPropComments(nextStats);
    nextArr.forEach((typeRef) => {
        if (!prevSet.has(typeRef)) {
            res.push(typeRef);
        }
    });
    return res;

    function normMissingPropComments(stats: TDocGenStatsResult | undefined) {
        if (!stats) {
            return [];
        }
        return stats.missingPropComment.value.reduce<string[]>((acc, { typeRef, value }) => {
            value.forEach((propName) => {
                acc.push(`${typeRef}/${propName}`);
            });
            return acc;
        }, []);
    }
}
