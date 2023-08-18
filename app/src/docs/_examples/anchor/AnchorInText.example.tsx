import React from 'react';
import { Anchor, RichTextView } from '@epam/uui';

export default function AnchorInTextExample() {
    return (
        <div>
            <RichTextView>
                Any your text with
                {' '}
                <Anchor href="https://uui.epam.com/">link</Anchor>
                .
            </RichTextView>
        </div>
    );
}
