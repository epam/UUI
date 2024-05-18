import { Value } from '@udecode/plate-common';
import { SlateSchema } from './migrations/slate_migrations';

/** Slate schema needed to support legacy format which should be deprecated */
/** null historically added and should also be deprecated to in favor of undefined */
export type EditorValue = Value | SlateSchema | undefined | null;
