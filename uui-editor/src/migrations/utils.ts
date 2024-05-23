import { Value } from '@udecode/plate-common';
import { EditorValue } from '../types';
import { migrateSlateSchema } from './slate_migrations';
import { SlateSchema } from './types';

/** type guard to distinct slate format */
export const isSlateSchema = (value: EditorValue): value is SlateSchema => {
    return !!value && !Array.isArray(value);
};

/** migrate deprecated slate format if needed */
export const getMigratedPlateValue = (value: EditorValue): Value | undefined => {
    if (!value) return undefined; // get rid of nulls
    if (isSlateSchema(value)) {
        return migrateSlateSchema(value);
    }
    return value;
};

/** type guard to distinct plate format */
export const isPlateValue = (value: EditorValue): value is Value => {
    return Array.isArray(value);
};
