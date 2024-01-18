import { IMap } from '../../../../../../../types';

export function cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
    return new (map.constructor as any)(map) as IMap<TKey, TValue>;
}
