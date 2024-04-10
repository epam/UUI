import * as uuiComponents from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

interface RichTextViewMods {
    /**
     * Defines component size.
     * @default '14'
     */
    size?: '12' | '14' | '16';
}

export type RichTextViewProps = uuiComponents.RichTextViewProps & RichTextViewMods;

export const RichTextView = /* @__PURE__ */withMods<uuiComponents.RichTextViewProps, RichTextViewMods>(
    uuiComponents.RichTextView,
    (mods: RichTextViewMods) => ['uui-typography', `uui-typography-size-${mods.size || '14'}`],
);
