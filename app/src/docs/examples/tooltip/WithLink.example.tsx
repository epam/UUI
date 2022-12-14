import React from 'react';
import { FlexCell, FlexRow, IconContainer, Text, Tooltip } from '@epam/promo';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/notification-warning-outline-18.svg';
import css from './WithIconExample.scss';

export default function LinkTooltipExample() {
    const renderLinkMarkup = () => (
        <FlexCell width='auto' cx={ css.container } >
            <Text cx={ css.header } fontSize='14' lineHeight='18' font='sans-semibold'>Deprecation “Working from home”</Text>
            <Text cx={ css.content } fontSize='12' lineHeight='18'>The text field longer be supported. Deprecated date Dec 20, 2022.
                <a href="#"> Read KB</a></Text>
        </FlexCell>);

    return (
        <FlexRow spacing='6' alignItems='center'>
            <Text fontSize='14'>Working from home allowed for employees only</Text>
            <Tooltip content={ renderLinkMarkup() } color='white' trigger='click' delay={ 3 } >
                <IconContainer icon={ myIcon } color='amber' />
            </Tooltip>
        </FlexRow>
    );
}