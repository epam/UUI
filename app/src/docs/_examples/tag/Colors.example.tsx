import React, { useState } from 'react';
import { FlexCell, FlexRow, RichTextView, Tag, TagMods } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';

const items: TagMods[] = [
    { color: 'neutral' },
    { color: 'info' },
    { color: 'success' },
    { color: 'warning' },
    { color: 'critical' },
];

export default function BasicExample() {
    const [value] = useState<number| string>('99+');

    return (
        <FlexCell width="100%">
            <RichTextView><h6>Solid</h6></RichTextView>
            <FlexRow spacing="12">
                {items.map((tag) => <Tag icon={ MyIcon } color={ tag.color } caption={ `Color ${tag.color}` } count={ value } onClick={ () => {} } />)}
            </FlexRow>
            <RichTextView><h6>Outline</h6></RichTextView>
            <FlexRow spacing="12">
                {items.map((tag) => <Tag fill="outline" icon={ MyIcon } color={ tag.color } caption={ `Color ${tag.color}` } count={ value } onClick={ () => {} } />)}
            </FlexRow>
        </FlexCell>
    );
}
