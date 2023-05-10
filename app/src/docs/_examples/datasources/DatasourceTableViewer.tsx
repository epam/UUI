import React from 'react';
import {
    DataColumnProps, DataTableState, IDataSource, IEditable,
} from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/promo';
import css from './DatasourceTableViewer.scss';

interface Props<TItem, TId> extends IEditable<DataTableState> {
    exampleTitle?: string;
    selectAll?: boolean;
    getName?: (item: TItem) => string;
    columns: DataColumnProps<TItem>[];
    datasource: IDataSource<TItem, TId, any>;
}

export default function DatasourceTableViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, datasource, columns, exampleTitle } = props;
    const view = datasource.useView(value, onValueChange);

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
