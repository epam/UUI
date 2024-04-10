export const clearEmptyValueFromRecord = <TRecord extends Record<string, any> = Record<string, any>>(record: TRecord): TRecord => {
    if (record === undefined || record === null || typeof record !== 'object') {
        return record;
    }

    return Object.keys(record).reduce((acc: TRecord | undefined, key) => {
        let newAcc = acc;
        if (record[key] !== undefined) {
            if (!newAcc) {
                newAcc = {} as TRecord;
            }
            (newAcc as Record<string, any>)[key] = record[key];
        }
        return newAcc;
    }, undefined);
};
