import { IThemeVarUI, TExpectedValueType } from '../../types/types';
import { getExpectedValue } from '../../utils/themeVarUtils';
import { Alert, IconContainer, LabeledInput, Text, Tooltip } from '@epam/uui';
import { ReactComponent as ErrIcon } from '@epam/assets/icons/common/notification-error-fill-24.svg';
import { ReactComponent as OkIcon } from '@epam/assets/icons/common/notification-check-fill-24.svg';
import React, { useMemo } from 'react';

export function ThemeVarInfo(props: { themeVar: IThemeVarUI, expectedValueType: TExpectedValueType }) {
    const { themeVar, expectedValueType } = props;
    const expected = getExpectedValue({ themeVar, expectedValueType });
    const actual = themeVar.valueCurrent;
    const hasErrors = actual.errors.length > 0;

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
            let chain = null;
            let aliasChainNotes = '';
            if (expected.alias.length) {
                if (expected.alias.length > 1) {
                    aliasChainNotes = ' (the value is taken from the last alias in the list below)';
                }
                chain = expected.alias.map(({ id, cssVar, supported }, index) => {
                    return (
                        <React.Fragment key={ id }>
                            <div style={ { whiteSpace: 'nowrap', clear: 'both' } }>
                                {`${index + 1}) `}
                                {id}
                                { supported && (`${cssVar}`)}
                            </div>
                        </React.Fragment>
                    );
                });
                chain = (
                    <>
                        <Text>{'Alias' + aliasChainNotes + ':'}</Text>
                        {chain}
                    </>
                );
            }

            return (
                <LabeledInput label="Expected:" labelPosition="left">
                    {expected.value}
                    {chain && <Alert color="info">{chain}</Alert>}
                </LabeledInput>
            );
        }
        return null;
    };

    const getTooltipContent = () => {
        return (
            <Text color="primary">
                <LabeledInput label="Actual:" labelPosition="left">
                    {actual.value !== '' ? actual.value : '<empty>'}
                </LabeledInput>
                { renderExpected() }
                {
                    hasErrors && (
                        <>
                            {actual.errors.map((err) => (
                                <Alert color="error" key={ err.type }>{err.message}</Alert>
                            ))}
                        </>
                    )
                }
            </Text>
        );
    };

    return (
        <Tooltip content={ getTooltipContent() } color="neutral" maxWidth={ 400 } closeOnMouseLeave="boundary">
            {iconNode}
        </Tooltip>
    );
}
