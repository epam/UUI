import React from 'react';
import { Alert, FlexCell, Text, SuccessAlert, WarningAlert, ErrorAlert, HintAlert } from '@epam/promo';
import * as css from './BasicExample.scss';
import * as accountIcon from '@epam/assets/icons/common/action-account-24.svg';
export function BasicAlertExample() {
    return (
        <FlexCell cx={ css.container } grow={ 1 }>
            <SuccessAlert> <Text size="24" fontSize='14'> Success notification </Text> </SuccessAlert>
            <WarningAlert> <Text size="24" fontSize='14'> Warning notification </Text> </WarningAlert>
            <ErrorAlert> <Text size="24" fontSize='14'> Error notification </Text> </ErrorAlert>
            <HintAlert onClose={ () => alert('close action') } actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }>
                <Text size="24" fontSize='14'> Hint notification with actions </Text>
            </HintAlert>

            <Alert icon={ accountIcon } color='amber' onClose={ () => alert('close action') } actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] } >
                <Text size="24" fontSize='14'>Custom Alert notification with actions</Text>
            </Alert>
        </FlexCell>
    );
}