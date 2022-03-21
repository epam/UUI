import { DataTable, useForm, NotificationCard, Text } from 'epam-promo';
import React from 'react';
import { DataQueryFilter, useLazyDataSource, useTableState, useUuiContext, UuiContexts } from 'uui-core';
import { Product } from 'uui-docs';
import type { TApi } from '../../data';
import { productColumns } from './columns';

interface EditableState {
    items: Record<number, Product>;
}

export const ProductsTableDemo: React.FC = (props) => {
    const svc = useUuiContext<TApi, UuiContexts>();

    const { lens } = useForm<EditableState>({
        value: { items: { 1: { ProductID: 1, Name: "!Changed!" } as any } },
        onSave: (value) => svc.uuiNotifications.show(() =>
            <NotificationCard onClose={null} onSuccess={null} color='blue' id={1} key='1'>
                <Text>{ JSON.stringify(value) }</Text>
            </NotificationCard>
        )
    });

    const { tableState, setTableState } = useTableState<any>({ columns: productColumns });

    const dataSource = useLazyDataSource<Product, number, DataQueryFilter<Product>>({
        api: svc.api.demo.products,
        getId: i => i.ProductID,
    }, []);

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowLens: (id) => lens.prop('items').prop(id)
    });

    return <DataTable
        headerTextCase='upper'
        getRows={ dataView.getVisibleRows }
        columns={ productColumns }
        value={ tableState }
        onValueChange={ setTableState }
        showColumnsConfig
        allowColumnsResizing
        allowColumnsReordering
        { ...dataView.getListProps() }
    />;
}