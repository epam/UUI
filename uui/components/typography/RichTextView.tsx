import * as uuiComponents from '@epam/uui-components';
import type { Overwrite } from '@epam/uui-core';
import { withMods } from '@epam/uui-core';
import { settings } from '../../settings';

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
    (mods: RichTextViewMods) => ['uui-typography', `uui-typography-size-${mods.size || settings.richTextView.sizes.default}`],
);
