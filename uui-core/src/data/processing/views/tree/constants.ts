export const ROOT_ID: undefined = undefined;

// ITreeNodeStatus
export const PARTIALLY_LOADED = 'PARTIALLY_LOADED';
export const FULLY_LOADED = 'FULLY_LOADED';
export const EMPTY = 'EMPTY';

// RecordStatus && not found item in tree
export const NOT_FOUND_RECORD = Symbol('NOT_FOUND_RECORD');

// RecordStatus
export const PENDING_RECORD = Symbol('PENDING_RECORD');
export const LOADING_RECORD = Symbol('LOADING_RECORD');
export const LOADED_RECORD = Symbol('LOADED_RECORD');
export const FAILED_RECORD = Symbol('FAILED_RECORD');

export const PatchOrdering = {
    TOP: Symbol('ORDERING_TOP'),
    BOTTOM: Symbol('ORDERING_BOTTOM'),
};

const ALWAYS = Symbol('ALWAYS');

export const SortingSettingsModifiers = {
    ALWAYS,
} as const;
