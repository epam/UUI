import { Task, InsertTaskCallback, ColumnsProps, DayKey } from "./types";
import { resources } from './demoData';
import React from "react";
import { DataTableCell, TextInput, NumericInput, PickerInput, DatePicker, Checkbox, TextArea, DataPickerRow, PickerItem } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from "@epam/uui-core";
import { generateDaysOfMonth, getDayName } from "./helpers";

const resourceDataSource = new ArrayDataSource({ items: resources });

const generateColumnForDay = (day: Date): DataColumnProps<Task, number, DataQueryFilter<Task>> => {
    const [key] = day.toISOString().split('T');

    const dayName = getDayName(day);
    const dayNumber = day.getDate();

    return {
        key,
        textAlign: 'right',
        caption: `${ dayName }, ${ dayNumber }`,
        info: `${ dayName }, ${ dayNumber }`,
        width: 70,
        canCopy: (cell) => true,
        canAcceptCopy: (from, to) => true,
        renderCell: (props) => (<DataTableCell
            { ...props.rowLens.prop(key as DayKey).toProps() }
            renderEditor={ props => (<NumericInput
                { ...props }
                formatOptions={ { maximumFractionDigits: 1 } }
            />) }
            { ...props }
        />),
    };
};

const generateColumnsForDays = (days: Date[]) => days.map(generateColumnForDay);

export function getColumns(columnsProps: ColumnsProps) {
    const days = generateDaysOfMonth();
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name',
            width: 100,
            fix: 'left',
            isSortable: true,
            renderCell: (props) => <DataTableCell
                padding='12'
                { ...props.rowLens.prop('name').toProps() }
                renderEditor={ props => <TextInput { ...props } /> }
                { ...props }
            />,
        },
        ...generateColumnsForDays(days),
    ];

    return columns;
}
