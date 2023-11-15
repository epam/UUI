import React, { useState } from 'react';
import { FlexCell, FlexRow, Badge } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import css from './SizeExample.module.scss';

export default function AdvancedBadgeExample() {
    const [value] = useState<number>(10);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <FlexRow spacing="12">
                <Badge color="info" fill="solid" caption="Status" onClick={ () => null } />
                <Badge color="info" fill="solid" caption="Status" onClear={ () => null } />
                <Badge color="info" fill="solid" caption="Status" count={ value } />
                <Badge color="info" fill="solid" caption="Status" icon={ MyIcon } onIconClick={ () => null } />
            </FlexRow>
            <FlexRow spacing="12">
                <Badge color="info" fill="outline" caption="Status" onClick={ () => null } />
                <Badge color="info" fill="outline" caption="Status" onClear={ () => null } />
                <Badge color="info" fill="outline" caption="Status" count={ value } />
                <Badge color="info" fill="outline" caption="Status" icon={ MyIcon } iconPosition="right" onIconClick={ () => null } />
            </FlexRow>
        </FlexCell>
    );
}
