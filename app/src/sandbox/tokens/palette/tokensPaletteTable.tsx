import React, { useMemo, useState } from 'react';
import { DataTableHeaderRow, DataTableRow, FlexRow, LabeledInput, Panel, ScrollBars } from '@epam/uui';
import { DataTableRowProps, DataTableState, useArrayDataSource, useColumnsConfig } from '@epam/uui-core';
import { useThemeTokens } from './hooks/useThemeTokens';
import { getColumns, sortBy } from './tableColumns';
import { IThemeVarUI, TThemeVarUiErr } from './types/types';
import css from './tokensPalette.module.scss';
import { themeName, TTheme } from '../../../common/docs/docsConstants';
import { useCurrentTheme } from './hooks/useCurrentTheme';
import { THEME_MAP } from './utils/themeVarUtils';

export function TokensPaletteTable() {
    const uuiTheme = useCurrentTheme();
    return (
        <TokensPaletteTableInner uuiTheme={ uuiTheme } key={ uuiTheme } />
    );
}
function TokensPaletteTableInner(props: { uuiTheme: TTheme }) {
    const uuiTheme = props.uuiTheme;
    const figmaTheme = THEME_MAP[uuiTheme];
    const tokens = useThemeTokens(uuiTheme);
    const [tableState, setTableState] = useState<DataTableState>({ topIndex: 0, visibleCount: Number.MAX_SAFE_INTEGER });
    const defaultColumns = useMemo(() => {
        return getColumns(figmaTheme);
    }, [figmaTheme]);
    const figmaThemeLabel = figmaTheme || 'Current theme isn\'t supported in Figma';
    const tokensDs = useArrayDataSource<IThemeVarUI, string, unknown>(
        {
            items: tokens,
            getId: (item) => {
                return item.id;
            },
            sortBy,
        },
        [tokens],
    );
    const tokensDsView = tokensDs.getView(tableState, setTableState, {});
    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig);
    const renderRow = (props: DataTableRowProps<IThemeVarUI, string>) => {
        return <DataTableRow key={ props.id } { ...props } columns={ columns } />;
    };

    const totalAmount = tokens.length;
    const amountMismatched = tokens.reduce((acc, { valueCurrent }) => {
        const isErr = valueCurrent.errors.find((e) => e.type === TThemeVarUiErr.VALUE_MISMATCHED);
        return isErr ? acc + 1 : acc;
    }, 0);
    const amountAbsent = tokens.reduce((acc, { valueCurrent }) => {
        const isErr = valueCurrent.errors.find((e) => e.type === TThemeVarUiErr.VAR_ABSENT);
        return isErr ? acc + 1 : acc;
    }, 0);
    const errMsg = [];
    if (amountMismatched) {
        errMsg.push(`${amountMismatched} mismatched`);
    }
    if (amountAbsent) {
        errMsg.push(`${amountAbsent} not defined`);
    }

    return (
        <div className={ css.layoutRoot }>
            <ScrollBars>
                <div className={ css.blockWrapper }>
                    <Panel background="surface-main" shadow style={ { maxHeight: '600px' } }>
                        <FlexRow padding="12" vPadding="24" rawProps={ { style: { flexWrap: 'wrap', gap: '3px' } } }>
                            <LabeledInput label="UUI Theme:" labelPosition="left">
                                {`${themeName[uuiTheme]} (${figmaThemeLabel})`}
                            </LabeledInput>
                            <LabeledInput label="Amount:" labelPosition="left">
                                {`${totalAmount} ${errMsg.length > 0 ? `(Errors: ${errMsg.join('; ')})` : ''}`}
                            </LabeledInput>
                        </FlexRow>
                        <ScrollBars>
                            <div className={ css.tableWrapper }>
                                <div className={ css.stickyHeader }>
                                    <DataTableHeaderRow
                                        columns={ columns }
                                        allowColumnsResizing={ true }
                                        value={ { ...tableState, columnsConfig } }
                                        onValueChange={ setTableState }
                                    />
                                </div>
                                { tokensDsView.getVisibleRows().map(renderRow) }
                            </div>
                        </ScrollBars>
                    </Panel>
                </div>
            </ScrollBars>
        </div>
    );
}
