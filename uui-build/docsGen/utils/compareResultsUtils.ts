import { TDocGenStatsResult } from '../types/types';
import { OUTPUT_FILE_COMPARISON_REPORT_MD, uuiRoot } from '../constants';
import { saveContentToFile } from './fileUtils';
import fs from 'fs';
import path from 'path';

type TCompareStatsResult = {
    propsNoComment: {
        prev: number | undefined,
        next: number,
        isIncreased: boolean,
        newWithNoComment: string[],
    }
    typesNoComment: {
        prev: number | undefined,
        next: number,
        isIncreased: boolean,
        newWithNoComment: string[],
    }
};

export function compareToPrevStats(nextStats: TDocGenStatsResult) {
    removeComparisonReportMd();
    const relPath = getPrevStatsFromCliArg();
    if (relPath) {
        const prevStats = getPrevStatsFromFile(relPath);
        const comparisonResult = compareStats({ prevStats, nextStats });
        saveComparisonReportMd(comparisonResult);
    }
}

function getPrevStatsFromCliArg() {
    const arg = process.argv[2];
    if (arg) {
        const [name, relPath] = arg.split('=');
        if (name === '--prev-stats') {
            return relPath;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }
}

function getPrevStatsFromFile(relPath: string): TDocGenStatsResult {
    const fullPath = path.resolve(uuiRoot, relPath);
    if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath).toString());
    } else {
        console.warn(`Prev stats not found. The file doesn't exist: ${fullPath}`);
        return;
    }
}

function compareStats(params: { prevStats: TDocGenStatsResult | undefined, nextStats: TDocGenStatsResult }): TCompareStatsResult {
    const { prevStats, nextStats } = params;

    if (prevStats) {
        const propsNoComment = {
            prev: prevStats.missingPropComment.totals.amountProps,
            next: nextStats.missingPropComment.totals.amountProps,
        };
        const typesNoComment = {
            prev: prevStats.missingTypeComment.totals.amountTypes,
            next: nextStats.missingTypeComment.totals.amountTypes,
        };
        return {
            propsNoComment: {
                ...propsNoComment,
                isIncreased: propsNoComment.next > propsNoComment.prev,
                newWithNoComment: getNewPropsWithNoComments(params),
            },
            typesNoComment: {
                ...typesNoComment,
                isIncreased: typesNoComment.next > typesNoComment.prev,
                newWithNoComment: getNewTypesWithNoComments(params),
            },
        };
    } else {
        return {
            propsNoComment: {
                prev: undefined,
                next: nextStats.missingPropComment.totals.amountProps,
                isIncreased: false,
                newWithNoComment: [],
            },
            typesNoComment: {
                prev: undefined,
                next: nextStats.missingTypeComment.totals.amountTypes,
                isIncreased: false,
                newWithNoComment: [],
            },
        };
    }
}

function getNewTypesWithNoComments(params: { prevStats: TDocGenStatsResult, nextStats: TDocGenStatsResult }): string[] {
    const res: string[] = [];
    const { prevStats, nextStats } = params;
    const prevSet = new Set(prevStats.missingTypeComment.value);
    nextStats.missingTypeComment.value.forEach((typeRef) => {
        if (!prevSet.has(typeRef)) {
            res.push(typeRef);
        }
    });
    return res;
}

function getNewPropsWithNoComments(params: { prevStats: TDocGenStatsResult, nextStats: TDocGenStatsResult }): string[] {
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

    function normMissingPropComments(stats: TDocGenStatsResult) {
        return stats.missingPropComment.value.reduce<string[]>((acc, { typeRef, value }) => {
            value.forEach((propName) => {
                acc.push(`${typeRef}/${propName}`);
            });
            return acc;
        }, []);
    }
}

function formatAmountWithDiff(prev: number | undefined, next: number) {
    let mdTypesAmountChange = '(no baseline :warning:)';
    if (prev !== undefined) {
        const typesAmountDiff = next - prev;
        let typesAmountSign = '';
        let emodji = ':ok:';
        if (typesAmountDiff < 0) {
            typesAmountSign = '-';
        } else if (typesAmountDiff > 0) {
            typesAmountSign = '+';
            emodji = ':no_entry:';
        }
        mdTypesAmountChange = `(${typesAmountSign}${typesAmountDiff}) ${emodji}`;
    }
    return `${next} ${mdTypesAmountChange}`;
}
function saveComparisonReportMd(result: TCompareStatsResult) {
    const isErr = result.typesNoComment.isIncreased || result.propsNoComment.isIncreased;
    const typesAmount = formatAmountWithDiff(result.typesNoComment.prev, result.typesNoComment.next);
    const propsAmount = formatAmountWithDiff(result.propsNoComment.prev, result.propsNoComment.next);
    const mdGeneratedBy = `Generated by: generate-components-api. Exceeds Limits: ${isErr ? 'yes' : 'no'} \n`;
    const SUMMARY_TITLE = 'New missing comments';
    const SUMMARY_DESC = 'NOTE: Comments in the entities below ares missed in the new report. But they aren\'t missed in the baseline report.';
    let detailsMd = '';
    if (isErr) {
        detailsMd = [
            '<details>',
            `<summary>${SUMMARY_TITLE}</summary>`,
            '<br>',
            SUMMARY_DESC,
            '',
            '```',
            result.typesNoComment.isIncreased ? `Types:\n${result.typesNoComment.newWithNoComment.map((line) => `- ${line}`).join('\n')}` : '',
            result.propsNoComment.isIncreased ? `Props:\n${result.propsNoComment.newWithNoComment.map((line) => `- ${line}`).join('\n')}` : '',
            '```',
            '</details>',
        ].join('\n');
    }
    const mdContent = `
${mdGeneratedBy}

| Entity  | Amount                    |
|:-------:|:-------------------------:|
|  Types without comments  |       ${typesAmount}      |
|  Props without comments  |       ${propsAmount}      |

${detailsMd}
`;
    saveContentToFile(OUTPUT_FILE_COMPARISON_REPORT_MD, mdContent);
}

function removeComparisonReportMd() {
    if (fs.existsSync(OUTPUT_FILE_COMPARISON_REPORT_MD)) {
        fs.rmSync(OUTPUT_FILE_COMPARISON_REPORT_MD, { force: true });
    }
}
