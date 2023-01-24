import React from "react";
import { DataTableCell, TextInput, NumericInput } from '@epam/promo';
import { DataColumnProps, DataQueryFilter, SelectedCellData } from "@epam/uui-core";
import { Task, DayKey } from "./types";
import { generateDaysOfHalfMonth, getDayName } from "./helpers";

const isSameRow = (from: SelectedCellData<Task, number, DataQueryFilter<Task>>, to: SelectedCellData<Task, number, DataQueryFilter<Task>>) =>
    from.row.id === to.row.id;

const isWorkingDay = (cell: SelectedCellData<Task, number, DataQueryFilter<Task>>) => {
    const day = new Date(cell.column.key).getDay();
    return day >= 0 && day <= 4;
};

const generateColumnForDay = (day: Date, isLast: boolean): DataColumnProps<Task, number, DataQueryFilter<Task>> => {
    const [key] = day.toISOString().split('T');

    const dayName = getDayName(day);
    const dayNumber = day.getDate();

    return {
        key,
        textAlign: isLast ? 'center' : 'right',
        caption: `${ dayName }, ${ dayNumber }`,
        width: isLast ? 100 : 70,
        canCopy: (cell) => true,
        canAcceptCopy: (from, to) =>
            isSameRow(from, to) && (
                (isWorkingDay(from) && isWorkingDay(to)) ||
                (!isWorkingDay(from) && !isWorkingDay(to))
            ),
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

const generateColumnsForDays = (days: Date[]) => days.map((day, index, arr) => generateColumnForDay(day, index === arr.length - 1));

export function getColumns() {
    const days = generateDaysOfHalfMonth();
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Project',
            width: 175,
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
