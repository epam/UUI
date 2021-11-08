import * as React from 'react';
import {
    ColumnsConfig, DataRowProps, DataColumnProps, IEditable, DataTableState, DataSourceListProps,
    DataTableColumnsConfigOptions, useUuiContext, useColumnsConfig,
} from '@epam/uui';
import { PositionValues } from '@epam/uui-components';
import { ColumnsConfigurationModal, DataTableHeaderRow, DataTableRow, DataTableMods } from './';
import { FlexRow, VirtualList, ScrollBars } from '../';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
}

export const DataTable = <TItem, TId = any>(props: React.PropsWithChildren<DataTableProps<TItem, TId> & DataTableMods>) => {
    const context = useUuiContext();
    const { columns, config, defaultConfig } = useColumnsConfig(props.columns, props.value.columnsConfig);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => (
        <DataTableRow
            key={ rowProps.rowKey }
            size={ props.size }
            borderBottom={ props.border }
            { ...rowProps }
        />
    );

    const getRows = () => {
        const renderItemRow = props.renderRow || renderRow;
        return props.getRows().map(row => renderItemRow({ ...row, columns }));
    };

    const renderNoResultsBlock = () => {
        // need default behavior
        return props.renderNoResultsBlock ? props.renderNoResultsBlock() : undefined;
    };

    const onConfigurationButtonClick = () => {
        context.uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ props.columns }
                columnsConfig={ config }
                defaultConfig={ defaultConfig }
            />
        ))
            .then(columnsConfig => props.onValueChange({ ...props.value, columnsConfig }))
            .catch(() => null);
    };

    return (
        <ScrollBars autoHeight hideTracksWhenNotNeeded autoHeightMax={ 100500 }>
            <DataTableHeaderRow
                columns={ columns }
                onConfigButtonClick={ props.showColumnsConfig && onConfigurationButtonClick }
                selectAll={ props.selectAll }
                size={ props.size }
                textCase={ props.headerTextCase }
                allowColumnsReordering={ props.allowColumnsReordering }
                allowColumnsResizing={ props.allowColumnsResizing }
                value={ props.value }
                onValueChange={ props.onValueChange }
            />
            <FlexRow topShadow background='white'>
                <div className={ css.listContainer }>
                    { props.exactRowsCount !== 0 ? getRows().slice(0, 200) : renderNoResultsBlock() }
                </div>
            </FlexRow>
        </ScrollBars>
    );
};
