import React from 'react';
import { Text } from '../typography';
import { IconButton } from '../buttons';
import { FlexRow } from '../layout';
import { settings } from '../../settings';

import css from './DataPickerHeader.module.scss';

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerHeaderImpl: React.FC<DataPickerHeaderProps> = (props) => {
    const title = props.title && typeof props.title === 'string' ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : '';

    return (
        <FlexRow alignItems="center" borderBottom cx={ css.header }>
            <Text
                size={ settings.pickerInput.sizes.body.mobileHeaderTitleSize }
                cx={ css.title }
            >
                {title}
            </Text>
            <IconButton
                icon={ settings.pickerInput.icons.body.pickerBodyMobileHeaderCloseIcon }
                onClick={ () => props.close?.() }
                cx={ css.close }
            />
        </FlexRow>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);
