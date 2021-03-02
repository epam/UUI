import * as React from 'react';
import { FlexRow, Badge, FlexCell } from '@epam/promo';
import * as css from './SizeExample.scss';

export function ColorsBadgeExample() {
    return (
        <FlexCell width='auto' cx={ css.container } >
            <FlexRow spacing='12' >
                <Badge color='blue' fill='solid' caption='Status' />
                <Badge color='green' fill='solid' caption='Status' />
                <Badge color='amber' fill='solid' caption='Status' />
                <Badge color='red' fill='solid' caption='Status' />
                <Badge color='cyan' fill='solid' caption='Status' />
                <Badge color='orange' fill='solid' caption='Status' />
                <Badge color='purple' fill='solid' caption='Status' />
                <Badge color='violet' fill='solid' caption='Status' />
            </FlexRow>
            <FlexRow spacing='12' >
                <Badge color='blue' fill='semitransparent' caption='Status' />
                <Badge color='green' fill='semitransparent' caption='Status' />
                <Badge color='amber' fill='semitransparent' caption='Status' />
                <Badge color='red' fill='semitransparent' caption='Status' />
                <Badge color='cyan' fill='semitransparent' caption='Status' />
                <Badge color='orange' fill='semitransparent' caption='Status' />
                <Badge color='purple' fill='semitransparent' caption='Status' />
                <Badge color='violet' fill='semitransparent' caption='Status' />
            </FlexRow>
            <FlexRow spacing='12' >
                <Badge color='blue' fill='transparent' caption='Status' />
                <Badge color='green' fill='transparent' caption='Status' />
                <Badge color='amber' fill='transparent' caption='Status' />
                <Badge color='red' fill='transparent' caption='Status' />
                <Badge color='cyan' fill='transparent' caption='Status' />
                <Badge color='orange' fill='transparent' caption='Status' />
                <Badge color='purple' fill='transparent' caption='Status' />
                <Badge color='violet' fill='transparent' caption='Status' />
            </FlexRow>
        </FlexCell>
    );
}