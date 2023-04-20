import { DemoDb } from './DemoDb';
import { DbViewOptions, useDbView, useDbRef } from '@epam/uui-db';
import { DemoDbRef } from './DemoDbRef';

export function useDemoDbView<TResult, TParams = void>(
    fn: (db: DemoDb, params: TParams) => TResult,
    params?: TParams,
    options?: DbViewOptions<DemoDb, TResult, TParams>,
): TResult {
    return useDbView(fn, params, options);
}

export const useDemoDbRef = () => useDbRef<DemoDbRef>();
