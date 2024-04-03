import { FAILED_RECORD, LOADED_RECORD, LOADING_RECORD, NOT_FOUND_RECORD, PENDING_RECORD, PatchOrdering } from './constants';

export type RecordStatus =
| typeof PENDING_RECORD
| typeof LOADING_RECORD
| typeof LOADED_RECORD
| typeof NOT_FOUND_RECORD
| typeof FAILED_RECORD;

export type PatchOrderingType =
| typeof PatchOrdering.TOP
| typeof PatchOrdering.BOTTOM;
