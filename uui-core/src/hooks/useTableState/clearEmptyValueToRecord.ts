import isEmpty from "lodash.isempty";

export const clearEmptyValueToRecord = <TRecord extends Record<string, any> = Record<string, any>>(record: TRecord): TRecord => {
    const result = Object.keys(record).reduce((acc: any, key) => {
        if (record[key] !== undefined) {
            acc[key] = record[key];
        }
        return acc;
    }, {} as TRecord);

    return isEmpty(result) ? undefined : result;
}
