import React from 'react';
import { useArrayDataSource } from '@epam/uui-core';
import { FlexRow, LabeledInput, PickerInput } from '@epam/uui';
import { TThemeTokenValueType } from '../../types/types';
import { getFigmaTheme } from '../../utils/themeVarUtils';
import { ThemeId } from '../../../../../data';

type TokensSummaryProps = {
    uuiTheme: ThemeId,
    expectedValueType: TThemeTokenValueType,
    onChangeExpectedValueType: (v: TThemeTokenValueType) => void
};
export function TokensSummary(props: TokensSummaryProps) {
    const { uuiTheme, expectedValueType, onChangeExpectedValueType } = props;
    const figmaTheme = getFigmaTheme(uuiTheme);
    const figmaThemeLabel = figmaTheme || '<no such theme>';

    const MODE_LABELS: Record<TThemeTokenValueType, string> = {
        [TThemeTokenValueType.direct]: 'Direct',
        [TThemeTokenValueType.chain]: 'Chain of aliases',
    };
    const expectedValueDs = useArrayDataSource<{ id: TThemeTokenValueType, name: string }, string, any>(
        {
            items: Object.values(TThemeTokenValueType).map((id) => ({ id, name: MODE_LABELS[id] })),
        },
        [],
    );

    return (
        <FlexRow padding="12" vPadding="24" rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 6, paddingTop: 6 } } }>
            { figmaTheme && (
                <LabeledInput label="Expected value:" labelPosition="left">
                    <PickerInput
                        value={ expectedValueType }
                        onValueChange={ onChangeExpectedValueType }
                        dataSource={ expectedValueDs }
                        selectionMode="single"
                        valueType="id"
                        searchPosition="none"
                        disableClear={ true }
                    />
                </LabeledInput>
            )}
            <LabeledInput label="Figma theme:" labelPosition="left">
                <span style={ { whiteSpace: 'nowrap' } }>
                    {figmaThemeLabel}
                </span>
            </LabeledInput>
        </FlexRow>
    );
}
