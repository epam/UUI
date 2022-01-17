import * as React from 'react';
import { VirtualList, DataTableHeaderRow, DataTableRow, ColumnsConfigurationModal } from '@epam/loveship';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { IEditable, DataQueryFilter, IDataSourceView, DataRowProps, cx, uuiScrollShadows, useUuiContext, UuiContexts, ColumnsConfig, useColumnsConfig, DataTableState } from '@epam/uui';
import { getColumns } from './columns';
import type { VirtualListRenderRowsParams } from '@epam/uui-components';
import type { PersonsSummary } from './PersonsTableDemo';
import type{ TApi } from '../../data';
import * as css from './PersonsTable.scss';

export interface PersonsTableProps extends IEditable<DataTableState> {
    view: IDataSourceView<PersonTableRecord, PersonTableRecordId, DataQueryFilter<PersonTableFilter>>;
    summary: PersonsSummary;
    showColumnsConfig: boolean;
}

export const PersonsTable = (props: PersonsTableProps) => {
    const { uuiModals } = useUuiContext<TApi, UuiContexts>();
    const { groupColumns, personColumns, summaryColumns } = React.useMemo(() => getColumns(), []);
    const { columns: personColumnsSync, config, defaultConfig } = useColumnsConfig(personColumns, props.value?.columnsConfig);
    const { columns: summaryColumnsSync } = useColumnsConfig(summaryColumns, props.value?.columnsConfig);
    const { exactRowsCount, totalCount } = props.view.getListProps();

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        const cols = (props.isLoading || props.value?.__typename === 'Person') ? personColumnsSync : groupColumns;
        return <DataTableRow key={ String(props.id) } { ...props } columns={ cols } />;
    };

    const getRows = () => {
        return props.view.getVisibleRows().map(row => renderRow({ ...row, columns: personColumns }));
    };

    const onConfigurationButtonClick = () => {
        uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ personColumns }
                columnsConfig={ config }
                defaultConfig={ defaultConfig }
            />
        ))
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    };

    const renderRowsContainer = ({ listContainerRef, estimatedHeight, offsetY, scrollShadows }: VirtualListRenderRowsParams) => (
        <>
            <div className={ css.stickyHeader }>
                <DataTableHeaderRow
                    columns={ personColumnsSync }
                    textCase='upper'
                    onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
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
                columns={ summaryColumnsSync }
                cx={ css.stickyFooter }
                id="footer"
                rowKey="footer"
                index={ 100500 }
                value={ props.summary }
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