import React, { useState } from 'react';
import { FlexCell, FlexRow, RichTextView, Tag } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';

export default function BasicExample() {
    const [value] = useState<number| string>('99+');

    return (
        <FlexCell width="100%">
            <RichTextView><h6>Solid</h6></RichTextView>
            <FlexRow columnGap="12">
                <Tag key={ 1 } icon={ MyIcon } color="neutral" caption="Color neutral" count={ value } onClick={ () => {} } />
                <Tag key={ 2 } icon={ MyIcon } color="info" caption="Color info" count={ value } onClick={ () => {} } />
                <Tag key={ 3 } icon={ MyIcon } color="success" caption="Color success" count={ value } onClick={ () => {} } />
                <Tag key={ 4 } icon={ MyIcon } color="warning" caption="Color warning" count={ value } onClick={ () => {} } />
                <Tag key={ 5 } icon={ MyIcon } color="critical" caption="Color critical" count={ value } onClick={ () => {} } />
            </FlexRow>
            <RichTextView><h6>Outline</h6></RichTextView>
            <FlexRow columnGap="12">
                <Tag fill="outline" key={ 6 } icon={ MyIcon } color="neutral" caption="Color neutral" count={ value } onClick={ () => {} } />
                <Tag fill="outline" key={ 7 } icon={ MyIcon } color="info" caption="Color info" count={ value } onClick={ () => {} } />
                <Tag fill="outline" key={ 8 } icon={ MyIcon } color="success" caption="Color success" count={ value } onClick={ () => {} } />
                <Tag fill="outline" key={ 9 } icon={ MyIcon } color="warning" caption="Color warning" count={ value } onClick={ () => {} } />
                <Tag fill="outline" key={ 10 } icon={ MyIcon } color="critical" caption="Color critical" count={ value } onClick={ () => {} } />
            </FlexRow>
        </FlexCell>
    );
}
