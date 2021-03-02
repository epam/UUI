import * as React from 'react';
import { Badge, FlexCell, FlexRow } from '@epam/promo';
import * as myIcon from '@epam/assets/icons/common/action-eye-18.svg';
import * as css from './SizeExample.scss';
import { useState } from 'react';

export function AdvancedBadgeExample() {
    const [value, onValueChange] = useState<number>(10);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <FlexRow spacing='12' >
                <Badge color='blue' fill='solid' caption='Status' onClick={ () => null } />
                <Badge color='blue' fill='solid' caption='Status' onClear={ () => null } />
                <Badge color='blue' fill='solid' caption='Status' count={ value } />
                <Badge color='blue' fill='solid' caption='Status' icon={ myIcon } onIconClick={ () => null } />
            </FlexRow>
            <FlexRow spacing='12' >
                <Badge color='blue' fill='semitransparent' caption='Status' onClick={ () => null } />
                <Badge color='blue' fill='semitransparent' caption='Status' onClear={ () => null } />
                <Badge color='blue' fill='semitransparent' caption='Status' count={ value } countPosition='right'  />
                <Badge color='blue' fill='semitransparent' caption='Status' icon={ myIcon } iconPosition='right' onIconClick={ () => null } />
            </FlexRow>
        </FlexCell>
    );
}