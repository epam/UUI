import { DataTable, useForm, NotificationCard, Text, Panel, Button, FlexCell, FlexRow, FlexSpacer  } from 'epam-promo';
import React from 'react';
import { DataQueryFilter, Metadata, useLazyDataSource, useTableState, useUuiContext, UuiContexts } from 'uui-core';
import { Product } from 'uui-docs';
import type { TApi } from '../../data';
import { productColumns } from './columns';

interface FormState {
    items: Record<number, Product>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    Name: {
                        isRequired: true,
                    },
                    DaysToManufacture: {
                        minValue: 1
                    }
                }
            }
        }
    }
}

export const ProductsTableDemo: React.FC = (props) => {
    const svc = useUuiContext<TApi, UuiContexts>();

    const { lens, save, isChanged, revert, canRevert } = useForm<FormState>({
        value: { items: { 1: { ProductID: 1, Name: "!Changed!" } as any } },
        onSave: (value) => svc.uuiNotifications.show(props =>
            <NotificationCard { ...props } color='blue' id={1} key='1'>
                <Text>{ JSON.stringify(value) }</Text>
            </NotificationCard>
        ),
        getMetadata: () => metadata,
    });

    const { tableState, setTableState } = useTableState<any>({ columns: productColumns });

    const dataSource = useLazyDataSource<Product, number, DataQueryFilter<Product>>({
        api: svc.api.demo.products,
        getId: i => i.ProductID,
    }, []);

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowLens: (id) => lens.prop('items').prop(id)
    });

    return <Panel>
        <FlexRow spacing='12' margin='12'>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button caption="Save" onClick={ save } isDisabled={ !isChanged } />
            </FlexCell>
            <FlexCell width='auto'>
            <Button caption="Revert" onClick={ revert } isDisabled={ !canRevert } />
            </FlexCell>
        </FlexRow>
        <DataTable
            headerTextCase='upper'
            getRows={ dataView.getVisibleRows }
            columns={ productColumns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            { ...dataView.getListProps() }
        />
    </Panel>;
}