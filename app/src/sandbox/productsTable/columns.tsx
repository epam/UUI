import { Text, Checkbox, DatePicker, NumericInput, TextInput, DataTableCell, PickerInput } from "@epam/promo";
import React from "react";
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from "@epam/uui-core";
import { Product } from "@epam/uui-docs";

const colors = [
    { id: 'RED', name: "Red" },
    { id: 'GREEN', name: "Green" },
    { id: 'BLUE', name: "Blue" },
    { id: 'BLACK', name: "Black" },
];

const colorsDataSource = new ArrayDataSource({ items: colors });

export const productColumns: DataColumnProps<Product, number, DataQueryFilter<Product>>[] = [
    {
        key: 'Name',
        caption: 'Name',
        width: 200,
        fix: 'left',
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('Name') }
            renderEditor={ ({ editorProps }) => <TextInput mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'Class',
        caption: 'Class',
        width: 85,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('Class') }
            renderEditor={ ({ editorProps }) => <TextInput mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'Color',
        caption: 'Color',
        width: 120,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('Color') }
            renderEditor={ ({ editorProps }) => <PickerInput valueType="id" selectionMode="single" dataSource={ colorsDataSource } mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'DaysToManufacture',
        textAlign: 'right',
        caption: 'Days To Manufacture',
        width: 200,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('DaysToManufacture') }
            background={ props.rowProps.value?.DaysToManufacture > 0 ? 'green' : undefined }
            renderEditor={ ({ editorProps }) => <NumericInput mode='cell' { ...editorProps } min={ 0 } max={ 100500 } /> }
            { ...props }
        />,
    },
    {
        key: 'DiscontinuedDate',
        caption: 'Discontinued Date',
        width: 200,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('DiscontinuedDate') }
            renderEditor={ ({ editorProps }) => <DatePicker format='MMM D, YYYY' mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'FinishedGoodsFlag',
        caption: 'Finished',
        width: 100,
        isSortable: true,
        textAlign: 'center',
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('FinishedGoodsFlag') }
            renderEditor={ ({ editorProps }) => <Checkbox { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'ListPrice',
        caption: 'List Price',
        width: 100,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('ListPrice') }
            renderEditor={ ({ editorProps }) => <NumericInput mode='cell' { ...editorProps } min={ 0 } max={ 100500 } /> }
            { ...props }
        />,
    },
    {
        key: 'MakeFlag',
        caption: 'In Production',
        width: 120,
        isSortable: true,
        textAlign: 'center',
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('MakeFlag') }
            renderEditor={ ({ editorProps }) => <Checkbox { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'ModifiedDate',
        caption: 'Modified Date',
        render: p => <DatePicker mode='cell' value={ p.ModifiedDate } onValueChange={ () => {} } format='MMM D, YYYY' />,
        width: 200,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('ModifiedDate') }
            renderEditor={ ({ editorProps }) => <DatePicker format='MMM D, YYYY' mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'LONG TEXT',
        caption: 'ID',
        render: p => <Text>Asa</Text>,
        width: 200,
        isSortable: true,
    },
    // {
    //     key: 'ProductLine',
    //     caption: 'Product Line',
    //     render: p => <TextInput mode='cell' value={ p.ProductLine } onValueChange={ () => {} } />,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'ProductModelID',
    //     caption: 'Product Model',
    //     render: p => <Text>{ p.ProductModelID }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'ProductNumber',
    //     caption: 'Code',
    //     render: p => <TextInput mode='cell' value={ p.ProductNumber } onValueChange={ () => {} } />,
    //     width: 120,
    //     isSortable: true,
    // },
    // {
    //     key: 'StandardCost',
    //     caption: 'Standard Cost',
    //     render: p => <NumericInput mode='cell' value={ p.StandardCost } onValueChange={ () => {} } min={ 0 } max={ 100500 } />,
    //     width: 150,
    //     isSortable: true,
    // },
    // {
    //     key: 'ProductSubcategoryID',
    //     caption: 'Product Subcategory',
    //     render: p => <Text>{ p.ProductSubcategoryID }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'ReorderPoint',
    //     caption: 'Reorder Point',
    //     render: p => <Text>{ p.ReorderPoint }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'SafetyStockLevel',
    //     caption: 'Safety Stock Level',
    //     render: p => <Text>{ p.SafetyStockLevel }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'SellStartDate',
    //     caption: 'Sell Start',
    //     render: p => <Text>{ p.SellStartDate }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'Size',
    //     caption: 'Size',
    //     render: p => <Text>{ p.Size }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'SizeUnitMeasureCode',
    //     caption: 'Size Unit',
    //     render: p => <Text>{ p.SizeUnitMeasureCode }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'Style',
    //     caption: 'Style',
    //     render: p => <Text>{ p.Style }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'Weight',
    //     caption: 'Weight',
    //     render: p => <Text>{ p.Weight }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
    // {
    //     key: 'WeightUnitMeasureCode',
    //     caption: 'Weight Unit',
    //     render: p => <Text>{ p.WeightUnitMeasureCode }</Text>,
    //     width: 200,
    //     isSortable: true,
    // },
];