import * as React from 'react';
import { Badge, Button, FlexCell, FlexRow } from '@epam/promo';
import * as css from './SizeExample.scss';

export function SizeExample() {
    return (
        <FlexCell width='auto' cx={ css.container } >
            <FlexRow alignItems='top' spacing='12' >
                <Badge size='42' color='blue' fill='solid' caption='Status' />
                <Badge size='36' color='blue' fill='solid' caption='Status' />
                <Badge size='30' color='blue' fill='solid' caption='Status' />
                <Badge size='24' color='blue' fill='solid' caption='Status' />
                <Badge size='18' color='blue' fill='solid' caption='Status' />
            </FlexRow>
            <FlexRow alignItems='top' spacing='12' >
                <Badge size='42' color='blue' fill='semitransparent' caption='Status' />
                <Badge size='36' color='blue' fill='semitransparent' caption='Status' />
                <Badge size='30' color='blue' fill='semitransparent' caption='Status' />
                <Badge size='24' color='blue' fill='semitransparent' caption='Status' />
                <Badge size='18' color='blue' fill='semitransparent' caption='Status' />
            </FlexRow>
            <FlexRow alignItems='center' spacing='12' >
                <Badge size='42' color='blue' fill='transparent' caption='Status' />
                <Badge size='36' color='blue' fill='transparent' caption='Status' />
                <Badge size='30' color='blue' fill='transparent' caption='Status' />
                <Badge size='24' color='blue' fill='transparent' caption='Status' />
                <Badge size='18' color='blue' fill='transparent' caption='Status' />
            </FlexRow>
        </FlexCell>
    );
}