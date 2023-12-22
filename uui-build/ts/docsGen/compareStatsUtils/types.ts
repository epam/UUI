type TCompareStatsEntry = {
    prev: number | undefined,
    next: number,
    isIncreased: boolean,
    newWithNoComment: string[],
};
export type TCompareStatsResult = {
    propsNoComment: TCompareStatsEntry
    typesNoComment: TCompareStatsEntry
};
