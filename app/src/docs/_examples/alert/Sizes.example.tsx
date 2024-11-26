import React from 'react';
import { FlexCell, Text, SuccessAlert, WarningAlert } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicAlertExample() {
    return (
        <FlexCell cx={ css.container } grow={ 1 }>
            <SuccessAlert
                size="36"
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                {' '}
                <Text size="30"> Success notification (size = 36) </Text>
                {' '}
            </SuccessAlert>
            <WarningAlert
                size="48"
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                {' '}
                <Text size="30"> Warning notification (default size = 48) </Text>
                {' '}
            </WarningAlert>
        </FlexCell>
    );
}
