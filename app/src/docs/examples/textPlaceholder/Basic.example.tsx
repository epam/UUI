import * as React from 'react';
import { FlexCell, TextPlaceholder } from '@epam/promo';
import * as css from './BasicExample.scss';

export function BasicExample() {
    return (
        <FlexCell width='auto' cx={ css.container } >
            <TextPlaceholder color='gray10' >Text</TextPlaceholder>
            <TextPlaceholder color='gray40' wordsCount={ 3 } >Three word text</TextPlaceholder>
            <TextPlaceholder color='gray40' wordsCount={ 5 } isNotAnimated >Five word text without animation</TextPlaceholder>
        </FlexCell>
    );
}