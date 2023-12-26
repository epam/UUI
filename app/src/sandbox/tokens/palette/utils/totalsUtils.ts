import { IThemeVarUI, STATUS_FILTER, TThemeVarUiErr, TTotals } from '../types/types';

export function getTotals(tokens: IThemeVarUI[]): TTotals {
    let mismatched = 0;
    let absent = 0;
    let all = 0;
    let ok = 0;

    tokens.forEach(({ value }) => {
        all++;
        const isMismatched = value.errors.find((e) => e.type === TThemeVarUiErr.VALUE_MISMATCHED);
        const isAbsent = value.errors.find((e) => e.type === TThemeVarUiErr.VAR_ABSENT);

        if (isMismatched || isAbsent) {
            if (isMismatched) {
                ++mismatched;
            }
            if (isAbsent) {
                ++absent;
            }
        } else {
            ++ok;
        }
    });

    return {
        [STATUS_FILTER.all]: all,
        [STATUS_FILTER.ok]: ok,
        [STATUS_FILTER.absent]: absent,
        [STATUS_FILTER.mismatched]: mismatched,
    };
}
