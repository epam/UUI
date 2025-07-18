import React from 'react';
import {
    DataColumnProps, DataSourceState, DataTableState, IDataSource, IEditable,
} from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/loveship';
import css from './DataSourceTableViewer.module.scss';

interface Props<TItem, TId> extends IEditable<DataTableState> {
    exampleTitle?: string;
    selectAll?: boolean;
    getName?: (item: TItem) => string;
    columns: DataColumnProps<TItem>[];
    dataSource: IDataSource<TItem, TId, any>;
    onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<any, TId>>>;
}

export function DataSourceTableViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, dataSource, columns, exampleTitle } = props;
    const view = dataSource.useView(value, onValueChange);

    return (
        <Panel shadow>
            <Text fontSize="14" cx={ css.title }>{exampleTitle}</Text>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ columns }
                headerTextCase="upper"
            />
        </Panel>
    );
}
