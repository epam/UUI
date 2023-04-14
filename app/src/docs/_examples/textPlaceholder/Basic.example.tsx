import React from 'react';
import { FlexCell, TextPlaceholder } from '@epam/promo';
import css from './BasicExample.scss';

export default function BasicExample() {
    return (
        <FlexCell width='auto' cx={ css.container } >
            <TextPlaceholder >Text</TextPlaceholder>
            <TextPlaceholder wordsCount={ 3 } >Three word text</TextPlaceholder>
            <TextPlaceholder wordsCount={ 5 } isNotAnimated >Five word text without animation</TextPlaceholder>
        </FlexCell>
    );
}
