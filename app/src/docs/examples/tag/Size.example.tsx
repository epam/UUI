import * as React from 'react';
import { FlexCell, FlexRow, Tag } from '@epam/promo';
import * as css from './SizeExample.scss';

export function SizeExample() {
    return (
        <FlexCell width='auto' cx={ css.container } >
            <FlexRow alignItems='top' spacing='12' >
                <Tag size='42' caption='Simple Tag' />
                <Tag size='36' caption='Simple Tag' />
                <Tag size='30' caption='Simple Tag' />
                <Tag size='24' caption='Simple Tag' />
                <Tag size='18' caption='Simple Tag' />
            </FlexRow>
        </FlexCell>
    );
}