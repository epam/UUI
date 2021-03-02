import * as css from './RichTextView.scss';
import * as style from '../../assets/styles/scss/typography.scss';
import { RichTextView as uuiRichTextView, RichTextViewProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';

export interface RichTextViewMods {
    theme?: 'light' | 'dark';
    size?: '12' | '14' | '16';
}

export const RichTextView = withMods<RichTextViewProps, RichTextViewMods>(uuiRichTextView, (mods: RichTextViewMods) => [
    css.text,
    css['theme-' + (mods.theme || 'light')],
    style.typographyLoveship,
    style['typography-' + (mods.size || '14')],
]);
