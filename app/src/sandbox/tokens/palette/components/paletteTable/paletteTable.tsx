import React, { useMemo, useState } from 'react';
import {
    DataTableHeaderRow,
    DataTableRow,
    FiltersPanel,
    FlexRow,
    Panel,
    ScrollBars,
} from '@epam/uui';
import { DataTableRowProps, DataTableState, useArrayDataSource, useColumnsConfig, useTableState } from '@epam/uui-core';
import {
    getColumns,
    getFilter,
    getFiltersConfig,
    getSortBy,
} from './tableColumns';
import { IThemeVarUI, TExpectedValueType, TTokensFilter } from '../../types/types';
import { TTheme } from '../../../../../common/docs/docsConstants';
//
import css from './paletteTable.module.scss';
import { getTotals } from '../../utils/totalsUtils';
import { TokensSummary } from './tokensSummary';
import { getFigmaTheme } from '../../utils/themeVarUtils';

const TOP_INDENT = '135px'; // 60px header + 75px summary/filter area

type PaletteTableProps = {
    uuiTheme: TTheme,
    expectedValueType: TExpectedValueType,
    onChangeExpectedValueType: (v: TExpectedValueType) => void
    tokens: IThemeVarUI[],
};
export function PaletteTable(props: PaletteTableProps) {
    const { uuiTheme, expectedValueType, onChangeExpectedValueType, tokens } = props;
    const figmaTheme = getFigmaTheme(uuiTheme);

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
    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig || {});
    const renderRow = (props: DataTableRowProps<IThemeVarUI, string>) => {
        return <DataTableRow key={ props.id } { ...props } columns={ columns } />;
    };

    return (
        <Panel background="surface-main" shadow>
            <FlexRow
                padding="12"
                vPadding="24"
                rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 0 } } }
            >
                <FiltersPanel<TTokensFilter>
                    filters={ filtersConfig }
                    tableState={ tableState }
                    setTableState={ setTableState }
                />
                <TokensSummary
                    uuiTheme={ uuiTheme }
                    expectedValueType={ expectedValueType }
                    onChangeExpectedValueType={ onChangeExpectedValueType }
                />
            </FlexRow>
            <ScrollBars style={ { height: `calc(100vh - ${TOP_INDENT})`, marginBottom: '0px' } }>
                <div>
                    <div className={ css.stickyHeader }>
                        <DataTableHeaderRow
                            columns={ columns }
                            allowColumnsResizing={ false }
                            value={ { ...tableState, columnsConfig } }
                            onValueChange={ setTableState }
                        />
                    </div>
                    { tokensDsView.getVisibleRows().map(renderRow) }
                </div>
            </ScrollBars>
        </Panel>
    );
}
