import { LOADING_RECORD, NOT_FOUND_RECORD } from '../../constants';

export const isFound = <TItem, >(item: TItem | typeof LOADING_RECORD | typeof NOT_FOUND_RECORD): item is TItem =>
    item !== LOADING_RECORD && item !== NOT_FOUND_RECORD;
