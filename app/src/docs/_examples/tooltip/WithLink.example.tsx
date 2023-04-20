import React from 'react';
import {
    FlexCell, FlexRow, IconContainer, Text, Tooltip,
} from '@epam/promo';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/notification-warning-outline-18.svg';
import css from './WithLinkExample.scss';

export default function LinkTooltipExample() {
    const renderTypesMarkup = () => (
        <FlexCell width="auto">
            <Text cx={ css.header } fontSize="14" lineHeight="18" font="sans-semibold">
                Deprecation “Working from home”
            </Text>
            <Text cx={ css.content } fontSize="12" lineHeight="18">
                The text field longer be supported. Deprecated date Dec 20, 2022.
                {' '}
                <a href="https://uui.epam.com">Read KB</a>
            </Text>
        </FlexCell>
    );

    return (
        <FlexRow alignItems="center">
            <Text fontSize="14">Working from home allowed for employees only</Text>
            <Tooltip content={ renderTypesMarkup() } placement="top" color="white" closeOnMouseLeave="boundary">
                <IconContainer icon={ myIcon } style={ { justifyContent: 'center', marginLeft: '3px' } } cx={ css.iconAmber } />
            </Tooltip>
        </FlexRow>
    );
}
