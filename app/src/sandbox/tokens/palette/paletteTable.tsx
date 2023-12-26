import React, { useMemo, useState } from 'react';
import {
    DataTableHeaderRow,
    DataTableRow,
    FiltersPanel,
    FlexRow,
    LabeledInput,
    Panel, PickerInput,
    ScrollBars,
} from '@epam/uui';
import { DataTableRowProps, DataTableState, useArrayDataSource, useColumnsConfig, useTableState } from '@epam/uui-core';
import { useThemeTokens } from './hooks/useThemeTokens';
import {
    getColumns,
    getFilter,
    getFiltersConfig,
    getSortBy,
    STATUS_FILTER,
    TTokensFilter,
    TTotals,
} from './paletteTableColumns';
import { IThemeVarUI, TExpectedValueType, TThemeVarUiErr } from './types/types';
import { themeName, TTheme } from '../../../common/docs/docsConstants';
import { useCurrentTheme } from './hooks/useCurrentTheme';
import { THEME_MAP } from './utils/themeVarUtils';
//
import css from './paletteTable.module.scss';

export function PaletteTable() {
    const uuiTheme = useCurrentTheme();
    const hasFigmaTheme = Boolean(THEME_MAP[uuiTheme]);
    return (
        <TokensPaletteTableInner uuiTheme={ uuiTheme } key={ String(hasFigmaTheme) } />
    );
}
function TokensPaletteTableInner(props: { uuiTheme: TTheme }) {
    const [expectedValueType, setExpectedValueType] = useState<TExpectedValueType>(TExpectedValueType.chain);
    const uuiTheme = props.uuiTheme;
    const figmaTheme = THEME_MAP[uuiTheme];
    const tokens = useThemeTokens(uuiTheme, expectedValueType);
    const filtersConfig = useMemo(() => {
        return getFiltersConfig(getTotals(tokens));
    }, [tokens]);
    const defaultColumns = useMemo(() => {
        return getColumns(figmaTheme, expectedValueType);
    }, [figmaTheme, expectedValueType]);
    const [value, onValueChange] = useState<DataTableState<TTokensFilter>>({
        topIndex: 0,
        visibleCount: Number.MAX_SAFE_INTEGER,
    });
    const { tableState, setTableState } = useTableState<TTokensFilter>({
        onValueChange,
        filters: filtersConfig,
        columns: defaultColumns,
        value,
    });
    const tokensDs = useArrayDataSource<IThemeVarUI, string, TTokensFilter>(
        {
            items: tokens,
            getId: (item) => {
                return item.id;
            },
            sortBy: getSortBy(),
            getFilter,
        },
        [tokens],
    );
    const tokensDsView = tokensDs.getView(tableState, setTableState, { });
    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig);
    const renderRow = (props: DataTableRowProps<IThemeVarUI, string>) => {
        return <DataTableRow key={ props.id } { ...props } columns={ columns } />;
    };

    return (
        <div className={ css.layoutRoot }>
            <ScrollBars>
                <div className={ css.blockWrapper }>
                    <Panel background="surface-main" shadow>
                        <FlexRow padding="12" vPadding="24" rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 0 } } }>
                            <FiltersPanel<TTokensFilter> filters={ filtersConfig } tableState={ tableState } setTableState={ setTableState } />
                            <TokensSummary uuiTheme={ uuiTheme } expectedValueType={ expectedValueType } onChangeExpectedValueType={ setExpectedValueType } />
                        </FlexRow>
                        <ScrollBars style={ { height: 'calc(100vh - 135px)', marginBottom: '0px' } }>
                            <div>
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

function TokensSummary(props: { uuiTheme: TTheme, expectedValueType: TExpectedValueType, onChangeExpectedValueType: (v: TExpectedValueType) => void }) {
    const { uuiTheme, expectedValueType, onChangeExpectedValueType } = props;
    const figmaTheme = THEME_MAP[uuiTheme];
    const figmaThemeLabel = figmaTheme || 'no such theme';
    const uuiThemeLabel = themeName[uuiTheme];

    const MODE_LABELS: Record<TExpectedValueType, string> = {
        [TExpectedValueType.direct]: 'Direct',
        [TExpectedValueType.chain]: 'Chain of aliases',
    };
    const expectedValueDs = useArrayDataSource<{ id: TExpectedValueType, name: string }, string, any>(
        {
            items: Object.values(TExpectedValueType).map((id) => ({ id, name: MODE_LABELS[id] })),
        },
        [],
    );

    return (
        <FlexRow padding="12" vPadding="24" rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 6, paddingTop: 6 } } }>
            <LabeledInput label="UUI:" labelPosition="left">
                <span style={ { whiteSpace: 'nowrap' } }>
                    {`${uuiThemeLabel}; `}
                </span>
            </LabeledInput>
            <LabeledInput label="Figma:" labelPosition="left">
                <span style={ { whiteSpace: 'nowrap' } }>
                    {figmaThemeLabel}
                </span>
            </LabeledInput>
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
        </FlexRow>
    );
}

function getTotals(tokens: IThemeVarUI[]): TTotals {
    let mismatched = 0;
    let absent = 0;
    let all = 0;
    let ok = 0;

    tokens.forEach(({ valueCurrent }) => {
        all++;
        const isMismatched = valueCurrent.errors.find((e) => e.type === TThemeVarUiErr.VALUE_MISMATCHED);
        const isAbsent = valueCurrent.errors.find((e) => e.type === TThemeVarUiErr.VAR_ABSENT);

        if (isMismatched || isAbsent) {
            if (isMismatched) {
                ++mismatched;
            }
            if (isAbsent) {
                ++absent;
            }
        } else {
            ++ok;
        }
    });

    return {
        [STATUS_FILTER.all]: all,
        [STATUS_FILTER.ok]: ok,
        [STATUS_FILTER.absent]: absent,
        [STATUS_FILTER.mismatched]: mismatched,
    };
}
