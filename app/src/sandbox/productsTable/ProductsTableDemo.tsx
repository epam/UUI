import React, { useCallback } from 'react';
import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer } from '@epam/loveship';
import { DataSourceState, ItemsMap, Metadata, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { Product } from '@epam/uui-docs';
import type { TApi } from '../../data';
import { productColumns } from './columns';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as add } from '@epam/assets/icons/common/action-add-12.svg';
import css from './ProductsTableDemo.module.scss';

interface FormState {
    items: ItemsMap<number, Product>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    Name: { isRequired: true },
                    Class: { isRequired: true },
                    Color: { isRequired: true },
                    DaysToManufacture: { minValue: 1 },
                },
            },
        },
    },
};

let savedValue: FormState = { items: ItemsMap.fromObject<number, Product>({}, { getId: (product) => product.ProductID }) };
let lastId = -1;

export function ProductsTableDemo() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const {
        lens, save, isChanged, revert, undo, canUndo, redo, canRedo, value: updatedRows, setValue,
    } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const [tableState, setTableState] = React.useState<DataSourceState>({});

    const insertTask = useCallback(() => {
        const product: Product = { ProductID: lastId-- } as Product;

        setValue((currentValue) => {
            return { ...currentValue, items: currentValue.items.set(product.ProductID, product) };
        });
    }, [setValue]);

    const dataSource = useLazyDataSource({
        api: svc.api.demo.products,
        patch: updatedRows.items,
        getId: (i) => i.ProductID,
        getRowOptions: (product) => ({ ...lens.prop('items').key(product.ProductID).default(product).toProps() }),
        backgroundReload: true,
    }, []);
    
    const view = dataSource.useView(tableState, setTableState, {});

    return (
        <Panel cx={ [css.container, css.uuiThemeLoveship] }>
            <FlexRow spacing="18" padding="24" vPadding="18" borderBottom={ true }>
                <FlexCell width="auto">
                    <Button size="30" icon={ add } caption="Add Task" onClick={ () => insertTask() } />
                </FlexCell>
            </FlexRow>
            <DataTable
                headerTextCase="upper"
                getRows={ view.getVisibleRows }
                columns={ productColumns }
                value={ tableState }
                onValueChange={ setTableState }
                showColumnsConfig
                allowColumnsResizing
                allowColumnsReordering
                { ...view.getListProps() }

            />
            {isChanged && (
                <FlexRow spacing="12" margin="12">
                    <FlexSpacer />
                    <FlexCell width="auto">
                        <Button icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                    </FlexCell>
                    <FlexCell width="auto">
                        <Button icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                    </FlexCell>
                    <FlexCell width="auto">
                        <Button caption="Save" onClick={ save } />
                    </FlexCell>
                    <FlexCell width="auto">
                        <Button caption="Revert" onClick={ revert } />
                    </FlexCell>
                </FlexRow>
            )}
        </Panel>
    );
}
