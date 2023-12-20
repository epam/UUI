import { IThemeVarUI } from '../../types/types';
import { getExpectedValue } from '../../utils/themeVarUtils';
import { Alert, IconContainer, LabeledInput, Text, Tooltip } from '@epam/uui';
import { ReactComponent as ErrIcon } from '@epam/assets/icons/common/notification-error-fill-24.svg';
import { ReactComponent as OkIcon } from '@epam/assets/icons/common/notification-check-fill-24.svg';
import React, { useMemo } from 'react';

export function ThemeVarInfo(props: { themeVar: IThemeVarUI }) {
    const { themeVar } = props;
    const expected = getExpectedValue({ themeVar });
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

    const getTooltipContent = () => {
        return (
            <Text color="primary">
                <LabeledInput label="Actual:" labelPosition="left">
                    {actual.value !== '' ? actual.value : '<empty>'}
                </LabeledInput>
                { expected && (
                    <LabeledInput label="Expected:" labelPosition="left">
                        {expected.value}
                    </LabeledInput>
                )}
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
        <Tooltip content={ getTooltipContent() } color="neutral">
            {iconNode}
        </Tooltip>
    );
}
