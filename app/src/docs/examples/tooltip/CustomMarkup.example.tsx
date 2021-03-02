import React from 'react';
import { Button, FlexRow, RichTextView, Tooltip } from '@epam/promo';

export function CustomMarkupExample() {
    const renderCustomMarkup = () => <RichTextView>
        <h5>Refusal reason</h5>
        <p>This candidate is not experienced enough for being a part of Assessment committee.</p>
    </RichTextView>;

    return (
        <FlexRow>
            <Tooltip trigger='hover' content={ renderCustomMarkup() } placement='top' color='white' >
                <Button data-foo={ 123 } caption='Target' onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}