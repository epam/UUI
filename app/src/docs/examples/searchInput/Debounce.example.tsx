import React, { useState } from 'react';
import { FlexCell } from '@epam/promo';
import * as css from './DebounceExample.scss';
import { SearchInput } from "@epam/uui";

export default function DebounceSearchInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width='auto' >
            <SearchInput value={ value } onValueChange={ onValueChange } placeholder='Type for search' debounceDelay={ 1000 } />
        </FlexCell>
    );
}