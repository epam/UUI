import React from 'react';
import { IconButton } from '../buttons';
import { FlexRow } from '../layout';
import { settings } from '../../settings';

import css from './DataPickerHeader.module.scss';

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerMobileHeaderImpl: React.FC<DataPickerHeaderProps> = (props) => {
    const title = props.title && typeof props.title === 'string' ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : '';

    return (
        <FlexRow alignItems="center" borderBottom cx={ [css.header, 'uui-picker_input-body-header'] }>
            <div className={ css.title }>
                {title}
            </div>
            <IconButton
                icon={ settings.pickerInput.icons.body.pickerBodyMobileHeaderCloseIcon }
                onClick={ () => props.close?.() }
                cx={ css.close }
            />
        </FlexRow>
    );
};

export const DataPickerMobileHeader = React.memo(DataPickerMobileHeaderImpl);
