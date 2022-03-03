import { DataTable, useForm, NotificationCard, Text } from 'epam-promo';
import { number } from 'prop-types';
import React, { useState } from 'react';
import { DataQueryFilter, DataTableState, useLazyDataSource, useUuiContext, UuiContexts } from 'uui-core';
import { Product } from 'uui-docs';
import type { TApi } from '../../data';
import { productColumns } from './columns';

interface EditableState {
    items: Record<number, Product>;
}

export const ProductsTableDemo: React.FC = (props) => {
    const svc = useUuiContext<TApi, UuiContexts>();

    const { lens } = useForm<EditableState>({
        value: { items: {} },
        onSave: (value) => svc.uuiNotifications.show(() =>
            <NotificationCard onClose={null} onSuccess={null} color='blue' id={1} key='1'>
                <Text>{ JSON.stringify(value) }</Text>
            </NotificationCard>
        )
    });

    const [state, setState] = useState<DataTableState>({});

    const dataSource = useLazyDataSource<Product, number, DataQueryFilter<Product>>({
        api: svc.api.demo.products,
        getId: i => i.ProductID,
    }, []);

    const dataView = dataSource.useView(state, setState, {});

    return <DataTable
        headerTextCase='upper'
        getRows={ dataView.getVisibleRows }
        columns={ productColumns }
        value={ state }
        onValueChange={ setState }
        showColumnsConfig
        allowColumnsResizing
        allowColumnsReordering
        { ...dataView.getListProps() }
    />;
}