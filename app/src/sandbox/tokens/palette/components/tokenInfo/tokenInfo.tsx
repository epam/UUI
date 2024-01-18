import { IThemeVarUI } from '../../types/types';
import { Alert, IconContainer, LabeledInput, Text, Tooltip } from '@epam/uui';
import { ReactComponent as ErrIcon } from '@epam/assets/icons/common/notification-error-fill-24.svg';
import { ReactComponent as OkIcon } from '@epam/assets/icons/common/notification-check-fill-24.svg';
import React, { useMemo } from 'react';
import { AliasChain } from './aliasChain';

export function TokenInfo(props: { token: IThemeVarUI }) {
    const { token } = props;
    const expected = token.value.figma;
    const actual = token.value.browser;
    const hasErrors = token.value.errors.length > 0;

    const iconNode = useMemo(() => {
        if (!hasErrors) {
            return (
                <IconContainer icon={ OkIcon } style={ { fill: 'var(--uui-success-50)' } } />
            );
        }
        return (
            <IconContainer icon={ ErrIcon } style={ { fill: 'var(--uui-error-50)' } } />
        );
    }, [hasErrors]);

    const renderExpected = () => {
        if (expected) {
            return (
                <LabeledInput label="Expected:" labelPosition="top">
                    <AliasChain resolved={ expected } />
                </LabeledInput>
            );
        }
        return null;
    };

    const renderErrors = () => {
        if (hasErrors) {
            return (
                token.value.errors.map((err) => (
                    <Alert color="error" key={ err.type }>{err.message}</Alert>
                ))
            );
        }
        return null;
    };

    const getTooltipContent = () => {
        return (
            <Text color="primary">
                <LabeledInput label="Actual:" labelPosition="top">
                    <div style={ { marginLeft: '24px' } }>{actual !== '' ? actual : '<empty>'}</div>
                </LabeledInput>
                { renderExpected() }
                { renderErrors() }
            </Text>
        );
    };

    return (
        <Tooltip content={ getTooltipContent() } color="neutral" maxWidth={ 400 } closeOnMouseLeave="boundary">
            {iconNode}
        </Tooltip>
    );
}
