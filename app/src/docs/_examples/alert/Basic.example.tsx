import React from 'react';
import { Alert, FlexCell, Text, SuccessAlert, WarningAlert, ErrorAlert, HintAlert, AlertProps } from '@epam/uui';
import css from './BasicExample.module.scss';
import { ReactComponent as AccountIcon } from '@epam/assets/icons/common/action-account-24.svg';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function BasicAlertExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', false, props) as AlertProps['size'];
    const textSize = sizes.includes('36') ? '30' : 'none'; // to support 4px grid themes

    return (
        <FlexCell cx={ css.container } grow={ 1 }>
            <SuccessAlert>
                {' '}
                <Text size={ textSize }> Success notification </Text>
                {' '}
            </SuccessAlert>
            <WarningAlert>
                {' '}
                <Text size={ textSize }> Warning notification </Text>
                {' '}
            </WarningAlert>
            <ErrorAlert>
                {' '}
                <Text size={ textSize }> Error notification </Text>
                {' '}
            </ErrorAlert>
            <HintAlert
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                <Text size={ textSize }> Hint notification with actions </Text>
            </HintAlert>

            <Alert
                icon={ AccountIcon }
                color="warning"
                onClose={ () => alert('close action') }
                actions={ [{ name: 'ACTION 1', action: () => null }, { name: 'ACTION 2', action: () => null }] }
            >
                <Text size={ textSize }>Custom Alert notification with actions </Text>
            </Alert>
        </FlexCell>
    );
}
