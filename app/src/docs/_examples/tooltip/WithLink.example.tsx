import React from 'react';
import { FlexCell, FlexRow, IconButton, Text, Tooltip } from '@epam/uui';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/notification-warning-outline-18.svg';
import css from './WithLinkExample.module.scss';

export default function LinkTooltipExample() {
    const renderTypesMarkup = () => (
        <FlexCell width="auto">
            <Text cx={ css.header } fontSize="14" lineHeight="18" fontWeight="600">
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
        <FlexRow alignItems="center" columnGap={ 3 }>
            <Text fontSize="14">Working from home allowed for employees only</Text>
            <Tooltip
                rawProps={ {
                    id: 'linkTooltipExample',
                } }
                content={ renderTypesMarkup() }
                color="neutral"
                closeOnMouseLeave="boundary"
            >
                <IconButton
                    icon={ myIcon }
                    color="warning"
                    onClick={ () => null }
                    rawProps={ {
                        'aria-describedby': 'linkTooltipExample',
                        'aria-label': 'More information about deprecation',
                    } }
                />
            </Tooltip>
        </FlexRow>
    );
}
