import isEmpty from 'lodash.isempty';

export const clearEmptyValueFromRecord = <TRecord extends Record<string, any> = Record<string, any>>(record: TRecord): TRecord => {
    if (record === undefined || record === null || typeof record !== 'object') {
        return record;
    }

    const result = Object.keys(record).reduce((acc: any, key) => {
        if (record[key] !== undefined) {
            acc[key] = record[key];
        }
        return acc;
    }, {} as TRecord);

    return isEmpty(result) ? undefined : result;
};
