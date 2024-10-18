import React, {
    ForwardRefExoticComponent, RefAttributes, useCallback, useEffect, useMemo, useState,
} from 'react';
import {
    DataColumnProps,
    DataTableRowProps,
    ICanBeReadonly,
    IDisableable,
    Metadata,
    useArrayDataSource,
    DataTableCellProps,
    RenderCellProps,
} from '@epam/uui-core';
import { useForm } from '@epam/promo';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as uui from '@epam/uui';
import { DatePickerProps } from '@epam/uui';
import { PickerInputBaseProps } from '@epam/uui-components';

// Defined interface describe data for each row
interface Item {
    id: number;
    text?: string;
    number?: number;
    selectedId?: number;
    selectedIds?: number[];
    date?: string;
    textArea?: string;
    bool?: boolean;
    meta?: IDisableable | ICanBeReadonly;
    altBackground?: boolean;
    cellBackground?: boolean;
}

const defaultItem: Partial<Item> = {
    text: 'Text Input',
    number: 1234567.89,
    selectedId: 1,
    selectedIds: [1, 2],
    textArea: 'Text Area',
    date: '2020-09-03',
    bool: true,
};

let id = 1;

// Prepare demo data for table rows
const items: Item[] = [
    { id: id++, ...defaultItem },
    { id: id++, ...defaultItem, altBackground: true },
    { id: id++, ...defaultItem, textArea: 'Supports\nmulti-line\ntext' }, // stretched vertically
    { id: id++ }, // invalid row
    { id: id++, altBackground: true },
    { id: id++, cellBackground: true },
    { id: id++, altBackground: true, cellBackground: true },
    { id: id++, ...defaultItem },
    { id: id++, ...defaultItem, cellBackground: true },
    { id: id++, ...defaultItem, cellBackground: true },
    { id: id++, ...defaultItem, cellBackground: true },
    { id: id++, ...defaultItem, cellBackground: true },
    { id: id++, ...defaultItem, cellBackground: true },
    {
        id: id++, ...defaultItem, cellBackground: true, altBackground: true,
    },
    {
        id: id++, ...defaultItem, cellBackground: true, altBackground: true,
    },
    {
        id: id++, ...defaultItem, cellBackground: true, altBackground: true,
    },
    {
        id: id++, ...defaultItem, cellBackground: true, altBackground: true,
    },
    {
        id: id++, ...defaultItem, cellBackground: true, altBackground: true,
    },
    { id: id++, ...defaultItem, meta: { isReadonly: true } },
    { id: id++, ...defaultItem, meta: { isDisabled: true } },
];

interface FormState {
    items: Item[];
}

const pickerItems = [
    { id: 1, name: 'Red' }, { id: 2, name: 'Green' }, { id: 3, name: 'Blue' }, { id: 4, name: 'Cyan' }, { id: 5, name: 'Magenta' }, { id: 6, name: 'Yellow' }, { id: 7, name: 'White' }, { id: 8, name: 'Black' },
];

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    text: { isRequired: true },
                    number: { isRequired: true },
                    selectedId: { isRequired: true },
                    selectedIds: { isRequired: true },
                    date: { isRequired: true },
                    textArea: { isRequired: true },
                    bool: { isRequired: true, validators: [(val) => [!val && 'Needs to be checked']] },
                },
                isDisabled: true,
            },
        },
    },
};

const skinMods = {
    promo: {
        border: 'gray30',
        altBackground: 'gray5',
        cellColors: [
            'gray5', 'red', 'blue', 'green', 'amber',
        ],
    },
    loveship: {
        border: 'night300',
        altBackground: 'night50',
        cellColors: [
            'night50', 'fire', 'sky', 'grass', 'sun',
        ],
    },
    uui: { border: true, altBackground: 'edited', cellColors: ['edited', 'invalid'] },
};

type SkinName = keyof typeof skinMods;

const skins = {
    promo: promo,
    loveship: loveship,
    uui: uui,
};

export default function TableCellsStylesSandbox() {
    const [skinName, setSkinName] = useState<SkinName>('promo');
    const skin: typeof promo | typeof loveship | typeof uui = skins[skinName];

    // These component types doesn't merge correctly/acceptably between skins
    const SkinDatePicker = skin.DatePicker as unknown as ForwardRefExoticComponent<DatePickerProps & RefAttributes<any>>;
    const SkinPickerInput = skin.PickerInput as React.FC<PickerInputBaseProps<any, any>>;
    const SkinDataTableCell = skin.DataTableCell as React.FC<DataTableCellProps & { background: any }>;

    // Use form to manage state of the editable table
    const { lens, save } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
        getMetadata: () => metadata,
    });

    // Trigger save, to force validation to show invalid cell states.
    useEffect(() => save(), []);

    // Use state to hold DataTable state - current sorting, filtering, etc.
    const [tableState, setTableState] = useState({});

    const pickerDataSource = useArrayDataSource({ items: pickerItems }, []);

    function getCellBackground(props: RenderCellProps) {
        if (props.rowProps.value.cellBackground != null) {
            const colors = [null, ...skinMods[skinName].cellColors];
            return colors[(props.index + props.rowProps.index) % colors.length];
        }
    }

    const columns = useMemo(
        () =>
            [
                {
                    key: 'meta',
                    caption: 'Row Type',
                    render: (item, row) => (
                        <skin.Text>
                            {Object.entries({
                                ...item.meta, rowBG: item.altBackground, cellBG: item.cellBackground, isInvalid: row.isInvalid,
                            })
                                .filter(([, value]) => !!value)
                                .map((e) => e[0])
                                .join(', ')}
                        </skin.Text>
                    ),
                    isSortable: true,
                    isAlwaysVisible: true,
                    width: 140,
                    fix: 'left',
                }, {
                    key: 'text',
                    caption: 'Text',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('text').toProps() }
                            renderEditor={ (props) => <skin.TextInput { ...props } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 120,
                }, {
                    key: 'number',
                    caption: 'Number',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('number').toProps() }
                            renderEditor={ (props) => <skin.NumericInput { ...props } formatOptions={ { minimumFractionDigits: 2 } } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    textAlign: 'right',
                    width: 120,
                }, {
                    key: 'checkbox',
                    caption: 'Checkbox',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('bool').toProps() }
                            renderEditor={ (props) => <skin.Checkbox { ...props } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 120,
                }, {
                    key: 'textarea',
                    caption: 'TextArea',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('textArea').toProps() }
                            renderEditor={ (props) => <skin.TextArea { ...props } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 120,
                }, {
                    key: 'date',
                    caption: 'Date',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('date').toProps() }
                            renderEditor={ (props) => <SkinDatePicker { ...props } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 200,
                }, {
                    key: 'singlePicker',
                    caption: 'Single Picker',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('selectedId').toProps() }
                            renderEditor={ (props) => <SkinPickerInput { ...props } selectionMode="single" dataSource={ pickerDataSource } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 200,
                }, {
                    key: 'multiPicker',
                    caption: 'Multi Picker',
                    renderCell: (props) => (
                        <SkinDataTableCell
                            { ...props.rowLens.prop('selectedIds').toProps() }
                            renderEditor={ (props) => <SkinPickerInput { ...props } selectionMode="multi" dataSource={ pickerDataSource } /> }
                            { ...props }
                            background={ getCellBackground(props) }
                        />
                    ),
                    isSortable: true,
                    width: 250,
                },
            ] as DataColumnProps<Item>[],
        [skinName],
    );

    const dataSource = useArrayDataSource(
        {
            items,
            getId: ({ id: listId }) => listId,
        },
        [],
    );

    const view = dataSource.useView(tableState, setTableState, {
        getRowOptions: (_: Item, index: number) => ({
            ...lens.prop('items').index(index).toProps(),
        }),
    });

    const renderRow = useCallback(
        (props: DataTableRowProps<Item, number>) => {
            return <skin.DataTableRow { ...props } />;
        },
        [skinName],
    );

    // Render the table, passing the prepared data to it in form of getRows callback, list props (e.g. items counts)
    return (
        <skin.Panel key={ skinName }>
            <skin.FlexRow>
                <skin.FlexCell width="auto">
                    <skin.MultiSwitch
                        value={ skinName }
                        onValueChange={ setSkinName }
                        items={ [
                            { id: 'loveship' as SkinName, caption: 'Loveship' }, { id: 'promo' as SkinName, caption: 'Promo' }, { id: 'uui' as SkinName, caption: 'UUI' },
                        ] }
                    />
                </skin.FlexCell>
            </skin.FlexRow>
            <skin.DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ columns }
                headerTextCase="upper"
                renderRow={ renderRow }
            />
        </skin.Panel>
    );
}
