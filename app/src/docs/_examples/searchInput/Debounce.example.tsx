import React, { useState } from 'react';
import { FlexCell, SearchInput } from '@epam/promo';
import css from './DebounceExample.scss';

export default function DebounceSearchInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={css.container} width="auto">
            <SearchInput value={value} onValueChange={onValueChange} placeholder="Type for search" debounceDelay={1000} />
        </FlexCell>
    );
}
