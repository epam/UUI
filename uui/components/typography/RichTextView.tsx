import * as uuiComponents from '@epam/uui-components';
import { Overwrite, withMods } from '@epam/uui-core';

interface RichTextViewMods {
    /**
     * Defines component size.
     * @default '14'
     */
    size?: '12' | '14' | '16';
}

export interface RichTextViewModsOverride {}

export interface RichTextViewProps extends uuiComponents.RichTextViewProps, Overwrite<RichTextViewMods, RichTextViewModsOverride> {}

export const RichTextView = withMods<uuiComponents.RichTextViewProps, RichTextViewProps>(
    uuiComponents.RichTextView,
    (mods: RichTextViewMods) => ['uui-typography', `uui-typography-size-${mods.size || '14'}`],
);
