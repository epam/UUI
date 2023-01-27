import { clearEmptyValueToRecord } from "./clearEmptyValueToRecord";

export const normalizeFilter = <TFilter = Record<string, any>>(filter: TFilter | undefined): TFilter => {
    if (filter === undefined) return filter;

    return clearEmptyValueToRecord<TFilter>(filter);
};
