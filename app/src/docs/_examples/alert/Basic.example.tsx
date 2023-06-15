import React from 'react';
import {
    Alert, FlexCell, Text, SuccessAlert, WarningAlert, ErrorAlert, HintAlert,
} from '@epam/promo';
import css from './BasicExample.module.scss';
import { ReactComponent as AccountIcon } from '@epam/assets/icons/common/action-account-24.svg';

export default function BasicAlertExample() {
    return (
        <FlexCell cx={ css.container } grow={ 1 }>
            <SuccessAlert>
                {' '}
                <Text size="30"> Success notification </Text>
                {' '}
            </SuccessAlert>
            <WarningAlert>
                {' '}
                <Text size="30"> Warning notification </Text>
                {' '}
            </WarningAlert>
            <ErrorAlert>
                {' '}
                <Text size="30"> Error notification </Text>
                {' '}
            </ErrorAlert>
            <HintAlert
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                <Text size="30"> Hint notification with actions </Text>
            </HintAlert>

            <Alert
                icon={ AccountIcon }
                color="amber"
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                <Text size="30">Custom Alert notification with actions</Text>
            </Alert>
        </FlexCell>
    );
}
