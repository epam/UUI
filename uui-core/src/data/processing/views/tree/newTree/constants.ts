export const ROOT_ID: undefined = undefined;
export const NOT_FOUND_RECORD = Symbol('NOT_FOUND_RECORD');
export const LOADING_RECORD = Symbol('LOADING_RECORD');
export const LOADED_RECORD = Symbol('LOADED_RECORD');
export const PARTIALLY_LOADED = 'PARTIALLY_LOADED';
export const FULLY_LOADED = 'FULLY_LOADED';
export const EMPTY = 'EMPTY';

export type RecordStatus = typeof LOADING_RECORD | typeof LOADED_RECORD;
