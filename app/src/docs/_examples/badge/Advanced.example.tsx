import React, { useState } from 'react';
import { Badge, FlexCell, FlexRow } from '@epam/promo';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import css from './SizeExample.scss';

export default function AdvancedBadgeExample() {
    const [value] = useState<number>(10);

    return (
        <FlexCell width="auto" cx={css.container}>
            <FlexRow spacing="12">
                <Badge color="blue" fill="solid" caption="Status" onClick={() => null} />
                <Badge color="blue" fill="solid" caption="Status" onClear={() => null} />
                <Badge color="blue" fill="solid" caption="Status" count={value} />
                <Badge color="blue" fill="solid" caption="Status" icon={MyIcon} onIconClick={() => null} />
            </FlexRow>
            <FlexRow spacing="12">
                <Badge color="blue" fill="semitransparent" caption="Status" onClick={() => null} />
                <Badge color="blue" fill="semitransparent" caption="Status" onClear={() => null} />
                <Badge color="blue" fill="semitransparent" caption="Status" count={value} countPosition="right" />
                <Badge color="blue" fill="semitransparent" caption="Status" icon={MyIcon} iconPosition="right" onIconClick={() => null} />
            </FlexRow>
        </FlexCell>
    );
}
