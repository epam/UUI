import React from 'react';
import { FlexCell, FlexRow, IconContainer, LinkButton, Text, Tooltip } from '@epam/uui';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/action-target-18.svg';
import css from './WithIconExample.module.scss';

export default function IconTooltipExample() {
    const renderIconMarkup = () => (
        <FlexRow columnGap="6" alignItems="top" cx={ css.container }>
            <IconContainer icon={ myIcon } style={ { marginTop: '3px', justifyContent: 'start' } } cx={ css.iconBlue } />
            <FlexCell width="auto">
                <Text cx={ css.header } fontSize="14" lineHeight="18" fontWeight="600">
                    Auto-update
                </Text>
                <Text cx={ css.content } fontSize="12" lineHeight="18">
                    Preselected during request-to-propose Jun 21, 2022 10:32
                </Text>
            </FlexCell>
        </FlexRow>
    );

    return (
        <FlexRow alignItems="center">
            <Tooltip content={ renderIconMarkup() } color="neutral">
                <LinkButton
                    color="secondary"
                    href="#"
                    caption="Jun 21, 2022 09:16"
                    underline="dashed"
                    weight="regular"
                    size="30"
                />
            </Tooltip>
        </FlexRow>
    );
}
