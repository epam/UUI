import React from 'react';
import { Text, TextProps } from '../typography';
import { IconButton } from '../buttons';
import { FlexRow } from '../layout';
import { settings } from '../../settings';
import { ReactComponent as CloseIcon } from '@epam/assets/icons/navigation-close-outline.svg';
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
                size={ settings.sizes.dataPickerHeader.text.size as TextProps['size'] }
                fontWeight={ settings.sizes.dataPickerHeader.text.fontWeight as TextProps['fontWeight'] }
            >
                {title}
            </Text>
            <IconButton icon={ CloseIcon } onClick={ () => props.close?.() } cx={ css.close } />
        </FlexRow>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);
