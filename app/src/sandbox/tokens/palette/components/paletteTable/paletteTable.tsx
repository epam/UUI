import React, { useMemo, useState } from 'react';
import {
    Blocker,
    DataTableHeaderRow,
    DataTableRow,
    FiltersPanel, FlexCell,
    FlexRow,
    Panel, PickerInput,
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
    getFiltersConfig,
    getSortBy,
} from './tableColumns';
import {
    ITokenRow,
    TLoadThemeTokensParams, TLoadThemeTokensResult, TThemeTokenValueType,
    TTokensLocalFilter,
} from '../../types/types';
import { getTotals } from '../../utils/totalsUtils';
import { TokensSummary } from './tokensSummary';
//
import css from './paletteTable.module.scss';
import { convertLocalTokens } from './localTokensConverter';
import { DEFAULT_LOCAL_FILTER } from '../../constants';

const TOP_INDENT = '135px'; // 60px header + 75px summary/filter area

type PaletteTableProps = {
    grouped: boolean,
    params: TLoadThemeTokensParams,
    onChangeParams: (updater: ((prevParams: TLoadThemeTokensParams) => TLoadThemeTokensParams)) => void,
    result: TLoadThemeTokensResult,
};

export function PaletteTable(props: PaletteTableProps) {
    const { params, result, grouped } = props;
    const { tokens, loading, uuiTheme } = result;
    const { valueType, filter } = params;

    const filtersConfig = useMemo(() => {
        return getFiltersConfig(getTotals(tokens));
    }, [tokens]);

    const defaultColumns = useMemo(() => {
        return getColumns({ uuiTheme, valueType, filter });
    }, [filter, uuiTheme, valueType]);

    const [value, onValueChange] = useState<DataTableState<TTokensLocalFilter>>({
        topIndex: 0,
        visibleCount: Number.MAX_SAFE_INTEGER,
        filter: DEFAULT_LOCAL_FILTER,
    });

    const { tableState, setTableState } = useTableState<TTokensLocalFilter>({
        onValueChange,
        filters: filtersConfig,
        columns: defaultColumns,
        value,
    });

    const items: ITokenRow[] = useMemo(() => {
        return convertLocalTokens({
            tokens,
            grouped,
            localFilter: tableState.filter,
        });
    }, [grouped, tokens, tableState.filter]);

    const tokensDs = useArrayDataSource<ITokenRow, string, TTokensLocalFilter>(
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
    const tokensDsView = tokensDs.useView(tableState, setTableState, {
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
                indent={ Math.min(rowProps.indent || 0, 1) }
            />
        );
    };

    const handleChangeValueType = (newValueType: TThemeTokenValueType) => {
        props.onChangeParams((prev) => {
            return {
                ...prev,
                valueType: newValueType,
            };
        });
    };

    return (
        <Panel background="surface-main" shadow>
            <FlexRow
                padding="12"
                vPadding="24"
                rawProps={ { style: { flexWrap: 'nowrap', gap: '3px', paddingBottom: 0 } } }
            >
                <ParamsFilters params={ props.params } onChangeParams={ props.onChangeParams } />
                <FiltersPanel<TTokensLocalFilter>
                    filters={ filtersConfig }
                    tableState={ tableState }
                    setTableState={ setTableState }
                />
                <TokensSummary
                    uuiTheme={ uuiTheme }
                    expectedValueType={ params.valueType }
                    onChangeExpectedValueType={ handleChangeValueType }
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

function ParamsFilters(props: {
    params: TLoadThemeTokensParams,
    onChangeParams: (updater: ((prevParams: TLoadThemeTokensParams) => TLoadThemeTokensParams)) => void,
}) {
    const handleChangeFilterPath = (newPath: string) => {
        props.onChangeParams((prev) => {
            return {
                ...prev,
                filter: {
                    ...prev.filter,
                    path: newPath,
                },
            };
        });
    };
    const handleChangeFilterPublished = (newPublished: 'yes' | 'no' | undefined) => {
        props.onChangeParams((prev) => {
            return {
                ...prev,
                filter: {
                    ...prev.filter,
                    published: newPublished,
                },
            };
        });
    };
    const dataSource = useArrayDataSource(
        {
            items: [
                {
                    id: 'yes',
                    label: 'Published',
                },
                {
                    id: 'no',
                    label: 'Not published',
                },
            ],
        },
        [],
    );
    return (
        <>
            <FlexCell style={ { width: '150px', flexBasis: 'auto' } }>
                <SearchInput
                    placeholder="Filter 'Path'"
                    value={ props.params.filter.path }
                    onValueChange={ handleChangeFilterPath }
                />
            </FlexCell>
            <FlexCell style={ { width: '150px', flexBasis: 'auto' } }>
                <PickerInput
                    placeholder="Filter 'Published'"
                    dataSource={ dataSource }
                    value={ props.params.filter.published }
                    onValueChange={ handleChangeFilterPublished }
                    getName={ (item) => item.label }
                    entityName="Published"
                    selectionMode="single"
                    valueType="id"
                />
            </FlexCell>
        </>
    );
}
