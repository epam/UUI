import * as React from 'react';
import { VirtualList, DataTableHeaderRow, DataTableRow } from '@epam/loveship';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { DataSourceState, IEditable, DataQueryFilter, IDataSourceView, DataRowProps, cx, uuiScrollShadows } from '@epam/uui';
import { VirtualListRenderRowsParams } from '@epam/uui-components';
import { getColumns } from './columns';
import type { PersonsSummary } from './PersonsTableDemo';
import * as css from './PersonsTable.scss';

export interface PersonsTableProps extends IEditable<DataSourceState> {
    view: IDataSourceView<PersonTableRecord, PersonTableRecordId, DataQueryFilter<PersonTableFilter>>;
    summary: PersonsSummary;
}

export const PersonsTable = (props: PersonsTableProps) => {
    const { groupColumns, personColumns, summaryColumns } = React.useMemo(() => getColumns(), []);
    const { exactRowsCount, totalCount } = props.view.getListProps();

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        const columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : groupColumns;
        return <DataTableRow key={ String(props.id) } { ...props } columns={ columns } />;
    };

    const getRows = () => {
        return props.view.getVisibleRows().map(row => renderRow({ ...row, columns: personColumns }));
    };

    const renderRowsContainer = ({ listContainerRef, estimatedHeight, offsetY, scrollShadows }: VirtualListRenderRowsParams) => (
        <>
            <div className={ css.stickyHeader }>
                <DataTableHeaderRow
                    columns={ personColumns }
                    textCase='upper'
                    selectAll={ props.view.selectAll }
                    allowColumnsReordering
                    allowColumnsResizing
                    value={ props.value }
                    onValueChange={ props.onValueChange }
                />
                <div className={ cx(uuiScrollShadows.top, {
                    [uuiScrollShadows.topVisible]: scrollShadows.vertical,
                }) } />
            </div>
            { props.view.getListProps().exactRowsCount !== 0 && (
                <div className={ css.listContainer } style={ { minHeight: `${estimatedHeight}px` } }>
                    <div
                        ref={ listContainerRef }
                        role='rowgroup'
                        style={ { marginTop: offsetY } }
                        children={ getRows() }
                    />
                </div>
            ) }
            <DataTableRow
                columns={ summaryColumns }
                cx={ css.stickyFooter }
                id="footer"
                rowKey="footer"
                index={ 100500 }
                value={ props.summary }
                size='48'
            />
        </>
    );

    return (
        <VirtualList
            value={ props.value }
            onValueChange={ props.onValueChange }
            rows={ getRows() }
            rowsCount={ exactRowsCount }
            focusedIndex={ props.value?.focusedIndex }
            shadow='dark'
            renderRows={ renderRowsContainer }
            cx={ cx(css.table, css.shadowDark) }
            rawProps={ {
                role: 'table',
                'aria-colcount': personColumns.length,
                'aria-rowcount': totalCount,
            } }
        />
    );
};