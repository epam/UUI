import React, { useMemo, useState } from 'react';
import {
    Blocker,
    DataTableHeaderRow,
    DataTableRow,
    FiltersPanel, FlexCell,
    FlexRow,
    Panel,
    ScrollBars, SearchInput,
} from '@epam/uui';
import {
    DataTableRowProps,
    DataTableState,
    useArrayDataSource,
    useColumnsConfig,
    useTableState,
} from '@epam/uui-core';
import {
    getColumns,
    getFilter,
    getFiltersConfig,
    getSortBy,
} from './tableColumns';
import {
    ITokenRow,
    ITokenRowGroup,
    TExpectedValueType,
    TTokensFilter,
} from '../../types/types';
import { TTheme } from '../../../../../common/docs/docsConstants';
//
import css from './paletteTable.module.scss';
import { getTotals } from '../../utils/totalsUtils';
import { TokensSummary } from './tokensSummary';
import { getFigmaTheme } from '../../utils/themeVarUtils';
import { TUseThemeTokensResult } from '../../hooks/useThemeTokens';

const TOP_INDENT = '135px'; // 60px header + 75px summary/filter area

type PaletteTableProps = {
    grouped: boolean,
    uuiTheme: TTheme,
    expectedValueType: TExpectedValueType,
    onChangeExpectedValueType: (v: TExpectedValueType) => void
    result: TUseThemeTokensResult,
    filter: { path: string },
    onChangeFilter: (params: { path: string }) => void;
};

export function PaletteTable(props: PaletteTableProps) {
    const { uuiTheme, expectedValueType, onChangeExpectedValueType, result, grouped } = props;
    const { tokens, loading } = result;
    const figmaTheme = getFigmaTheme(uuiTheme);

    const filtersConfig = useMemo(() => {
        return getFiltersConfig(getTotals(tokens));
    }, [tokens]);

    const defaultColumns = useMemo(() => {
        return getColumns(figmaTheme, expectedValueType, props.filter);
    }, [figmaTheme, expectedValueType, props.filter]);
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
    const items: ITokenRow[] = useMemo(() => {
        const filterFn = getFilter(tableState.filter);
        const tokensFiltered = tokens.filter(filterFn);
        if (grouped) {
            const parents = new Map<string, ITokenRowGroup>();
            const tokensWithParentId = tokensFiltered.map((srcToken) => {
                const group = getTokenParent(srcToken.id);
                if (group) {
                    parents.set(group.id, group);
                    return { ...srcToken, parentId: group.id };
                }
                return srcToken;
            });
            const parentsArr = Array.from(parents.values());
            return [...tokensWithParentId, ...parentsArr];
        }
        return tokensFiltered;
    }, [grouped, tokens, tableState.filter]);
    const tokensDs = useArrayDataSource<ITokenRow, string, TTokensFilter>(
        {
            items,
            getId: (item) => {
                return item.id;
            },
            sortBy: getSortBy(),
            getParentId: (item) => {
                if (grouped) {
                    return item.parentId;
                }
            },
        },
        [items],
    );
    const tokensDsView = tokensDs.getView(tableState, setTableState, {
        isFoldedByDefault: () => false,
    });
    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig || {});
    const renderRow = (rowProps: DataTableRowProps<ITokenRow, string>) => {
        return (
            <DataTableRow
                // cx={ cx }
                key={ rowProps.id }
                { ...rowProps }
                columns={ columns }
                indent={ Math.min(rowProps.indent, 1) }
            />
        );
    };

    return (
        <Panel background="surface-main" shadow>
            <FlexRow
                padding="12"
                vPadding="24"
                rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 0 } } }
            >
                <FlexCell style={ { width: '150px', flexBasis: 'auto' } }>
                    <SearchInput
                        placeholder="Filter 'Path'"
                        value={ props.filter.path }
                        onValueChange={ (newPath) => props.onChangeFilter({ ...props.filter, path: newPath }) }
                    />
                </FlexCell>
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
            <div>
                <Blocker isEnabled={ loading } cx={ css.blocker } />
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
            </div>
        </Panel>
    );
}

function getTokenParent(path: string): ITokenRowGroup {
    const pathSplit = path.split('/');
    const pathSplitArr = pathSplit.slice(0, pathSplit.length - 1);
    return { id: pathSplitArr.join('/'), _group: true };
}
