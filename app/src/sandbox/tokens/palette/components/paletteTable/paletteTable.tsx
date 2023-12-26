import React, { useMemo, useState } from 'react';
import {
    DataTableHeaderRow,
    DataTableRow,
    FiltersPanel,
    FlexRow,
    Panel,
    ScrollBars,
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
    IThemeVarUI,
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

const TOP_INDENT = '135px'; // 60px header + 75px summary/filter area

type PaletteTableProps = {
    grouped: boolean,
    uuiTheme: TTheme,
    expectedValueType: TExpectedValueType,
    onChangeExpectedValueType: (v: TExpectedValueType) => void
    tokens: IThemeVarUI[],
};

export function PaletteTable(props: PaletteTableProps) {
    const { uuiTheme, expectedValueType, onChangeExpectedValueType, tokens, grouped } = props;
    const figmaTheme = getFigmaTheme(uuiTheme);

    const filtersConfig = useMemo(() => {
        return getFiltersConfig(getTotals(tokens));
    }, [tokens]);

    const items: ITokenRow[] = useMemo(() => {
        if (grouped) {
            const parents = new Map<string, ITokenRowGroup>();
            const tokensWithParentId = tokens.map((srcToken) => {
                const idArr = getTokenParents(srcToken.id);
                idArr.forEach((group) => {
                    parents.set(group.id, group);
                });
                const par = idArr[idArr.length - 1];
                if (par) {
                    return { ...srcToken, parentId: par.id };
                }
                return srcToken;
            });
            const parentsArr = Array.from(parents.values());
            return [...tokensWithParentId, ...parentsArr];
        }
        return tokens;
    }, [grouped, tokens]);

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
    const tokensDs = useArrayDataSource<ITokenRow, string, TTokensFilter>(
        {
            items,
            getId: (item) => {
                return item.id;
            },
            sortBy: getSortBy(),
            getFilter,
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

function getTokenParents(path: string): ITokenRowGroup[] {
    const pathSplit = path.split('/');
    const pathSplitArr = pathSplit.slice(0, pathSplit.length - 1);
    const parents: ITokenRowGroup[] = [];
    pathSplitArr.forEach((pathToken) => {
        const lastToken = parents[parents.length - 1];
        if (lastToken) {
            parents.push({ id: `${lastToken.id}/${pathToken}`, _group: true, parentId: lastToken.id });
        } else {
            parents.push({ id: pathToken, _group: true });
        }
    });
    return parents;
}
