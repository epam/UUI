import style from './RichTextView.module.scss';
import { RichTextView as uuiRichTextView, RichTextViewProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export interface RichTextViewMods {
    size?: '12' | '14' | '16';
}

export const RichTextView = withMods<RichTextViewProps, RichTextViewMods>(uuiRichTextView, (mods: RichTextViewMods) => [style.typographyLoveship, style['typography-' + (mods.size || '14')]]);
