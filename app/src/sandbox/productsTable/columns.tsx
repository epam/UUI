import {
    Text, Checkbox, DatePicker, NumericInput, TextInput, DataTableCell, PickerInput,
} from '@epam/loveship';
import React from 'react';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from '@epam/uui-core';
import { Product } from '@epam/uui-docs';

const colors = [
    { id: 'Red', name: 'Red' },
    { id: 'Green', name: 'Green' },
    { id: 'Blue', name: 'Blue' },
    { id: 'Black', name: 'Black' },
    { id: 'Silver', name: 'Silver' },
];

const colorsDataSource = new ArrayDataSource({ items: colors });

export const productColumns: DataColumnProps<Product, number, DataQueryFilter<Product>>[] = [
    {
        key: 'Name',
        caption: 'Name',
        width: 200,
        fix: 'left',
        isSortable: true,
        renderCell: (props) => <DataTableCell columnsGap="12" { ...props.rowLens.prop('Name').toProps() } renderEditor={ (props) => <TextInput { ...props } /> } { ...props } />,
    }, {
        key: 'Class',
        caption: 'Class',
        width: 85,
        isSortable: true,
        renderCell: (props) => <DataTableCell { ...props.rowLens.prop('Class').toProps() } renderEditor={ (props) => <TextInput { ...props } /> } { ...props } />,
    }, {
        key: 'Color',
        caption: 'Color',
        width: 120,
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('Color').toProps() }
                renderEditor={ (props) => <PickerInput valueType="id" selectionMode="single" dataSource={ colorsDataSource } { ...props } /> }
                { ...props }
            />
        ),
    }, {
        key: 'DaysToManufacture',
        textAlign: 'right',
        caption: 'Days To Manufacture',
        width: 200,
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell { ...props.rowLens.prop('DaysToManufacture').toProps() } renderEditor={ (props) => <NumericInput { ...props } min={ 0 } /> } { ...props } />
        ),
    }, {
        key: 'DiscontinuedDate',
        caption: 'Discontinued Date',
        width: 200,
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell { ...props.rowLens.prop('DiscontinuedDate').toProps() } renderEditor={ (props) => <DatePicker format="MMM D, YYYY" { ...props } /> } { ...props } />
        ),
    }, {
        key: 'FinishedGoodsFlag',
        caption: 'Finished',
        width: 100,
        isSortable: true,
        textAlign: 'center',
        renderCell: (props) => <DataTableCell { ...props.rowLens.prop('FinishedGoodsFlag').toProps() } renderEditor={ (props) => <Checkbox { ...props } /> } { ...props } />,
    }, {
        key: 'ListPrice',
        caption: 'List Price',
        width: 100,
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('ListPrice').toProps() }
                renderEditor={ (props) => <NumericInput { ...props } min={ 0 } formatOptions={ { maximumFractionDigits: 2, minimumFractionDigits: 2 } } /> }
                { ...props }
            />
        ),
    }, {
        key: 'MakeFlag',
        caption: 'In Production',
        width: 120,
        isSortable: true,
        textAlign: 'center',
        renderCell: (props) => <DataTableCell { ...props.rowLens.prop('MakeFlag').toProps() } renderEditor={ (props) => <Checkbox { ...props } /> } { ...props } />,
    }, {
        key: 'ModifiedDate',
        caption: 'Modified Date',
        render: (p) => <DatePicker value={ p.ModifiedDate } onValueChange={ () => {} } format="MMM D, YYYY" />,
        width: 200,
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell { ...props.rowLens.prop('ModifiedDate').toProps() } renderEditor={ (props) => <DatePicker format="MMM D, YYYY" { ...props } /> } { ...props } />
        ),
    }, {
        key: 'ID',
        caption: 'ID',
        render: (p) => <Text>{p.ProductID}</Text>,
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
