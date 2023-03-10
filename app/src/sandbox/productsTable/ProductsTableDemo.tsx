import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer } from '@epam/loveship';
import React, { useMemo, useRef, useState } from 'react';
import { memorizedComparator, Metadata, useList, useUuiContext, UuiContexts } from '@epam/uui-core';
import { Product } from '@epam/uui-docs';
import type { TApi } from '../../data';
import { productColumns } from './columns';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';

interface FormState {
    items: Record<number, Product>;
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

let savedValue: FormState = { items: {} };

export const ProductsTableDemo: React.FC = (props) => {
    const svc = useUuiContext<TApi, UuiContexts>();
    // const [patch, setPatch] = useState<Product[]>([]);
    const lastPatchIdRef = useRef(-1);

    const memoComparator = useMemo(() => memorizedComparator<Product, number>(
        () => -1,
        i => i.ProductID,
    ), []);

    const { lens, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const addNewRow = () => {
        --lastPatchIdRef.current;
        const newValue = { ProductID: lastPatchIdRef.current } as Product;

        const items = lens.prop('items').get();
        lens.prop('items').set({ ...items, [lastPatchIdRef.current]: newValue });
    };

    const [tableState, setTableState] = React.useState({});

    const { rows, listProps } = useList({
        type: 'lazy',
        api: svc.api.demo.products,

        patch: Object.values(lens.prop('items').get()),
        isDeletedProp: 'IsDeleted',
        comparator: memoComparator,

        getId: i => i.ProductID,
        getRowOptions: product => ({ ...lens.prop('items').prop(product.ProductID).default(product).toProps() }),
        listState: tableState,
        setListState: setTableState,
    }, []);

    return <Panel style={ { width: '100%' } }>
        <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
            <FlexCell width='auto'>
                <Button caption="Add row" onClick={ () => addNewRow() } size='30' />
            </FlexCell>
        </FlexRow>
        <DataTable
            headerTextCase='upper'
            getRows={ () => rows }
            columns={ productColumns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            { ...listProps }
        />
        {
            isChanged && <FlexRow spacing='12' margin='12'>
                <FlexSpacer />
                <FlexCell width='auto'>
                    <Button icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button caption="Save" onClick={ save } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button caption="Revert" onClick={ revert } />
                </FlexCell>
            </FlexRow>
        }
    </Panel>;
};