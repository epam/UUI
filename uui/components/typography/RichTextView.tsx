import * as React from 'react';
import style from '../../assets/styles/typography.scss';
import { RichTextView as uuiRichTextView, RichTextViewProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export interface RichTextViewMods {
    size?: '12' | '14' | '16';
}

export const RichTextView = withMods<RichTextViewProps, RichTextViewMods>(uuiRichTextView, (mods: RichTextViewMods) => [style.typographyPromo, style['typography-' + (mods.size || '14')]]);
