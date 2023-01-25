import { DataTable, useForm, Panel, DataTableCell, NumericInput, TextInput } from '@epam/promo';
import React, { useMemo } from 'react';
import { DataQueryFilter, DataTableState, DataTableSelectedCellData, useArrayDataSource, DataColumnProps } from '@epam/uui-core';
import { ProjectReport, demoData, Day } from '@epam/uui-docs';

import css from "./TablesExamples.scss";

interface FormState {
    items: Record<number, ProjectReport>;
}

type SelectedCellData = DataTableSelectedCellData<ProjectReport, number, DataQueryFilter<ProjectReport>>;

const generateDaysOfHalfMonth = (month: number = 1) =>
    new Array(10).fill(0).map((_, index) => new Date(2023, month - 1, index + 1));

const getDayName = (date: Date, locale: string = 'en-US') => {
    return date.toLocaleDateString(locale, { weekday: 'short' });
};

export const getDemoTasks = () => demoData.projectReports.reduce((acc, task) => ({ ...acc, [task.id]: task }), {});

const isSameRow = (from: SelectedCellData, to: SelectedCellData) => from.row.id === to.row.id;

const isWorkingDay = (cell: SelectedCellData) => {
    const day = new Date(cell.column.key).getDay();
    return day >= 0 && day <= 4;
};

const generateColumnForDay = (day: Date, isLast: boolean = false): DataColumnProps<ProjectReport, number, DataQueryFilter<ProjectReport>> => {
    const [key] = day.toISOString().split('T');

    const dayName = getDayName(day);
    const dayNumber = day.getDate();

    return {
        key,
        textAlign: 'center',
        caption: `${ dayName }, ${ dayNumber }`,
        width: 73,
        ...(isLast ? { grow: 1 } : {}),
        canCopy: () => true,
        canAcceptCopy: (from, to) =>
            isSameRow(from, to) && (
                (isWorkingDay(from) && isWorkingDay(to)) ||
                (!isWorkingDay(from) && !isWorkingDay(to))
            ),
        renderCell: (props) => (<DataTableCell
            { ...props.rowLens.prop(key as Day).toProps() }
            renderEditor={ props => (<NumericInput
                { ...props }
                formatOptions={ { maximumFractionDigits: 1 } }
            />) }
            { ...props }
        />),
    };
};

const generateColumnsForDays = (days: Date[]) => days.map((day, index, arr) =>
    generateColumnForDay(day, index === arr.length - 1),
);

function getColumns() {
    const days = generateDaysOfHalfMonth();
    const columns: DataColumnProps<ProjectReport, number, DataQueryFilter<ProjectReport>>[] = [
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

const savedValue: FormState = { items: getDemoTasks() };

export default function ProjectTimeReportDemo() {
    const { lens, value, onValueChange } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            onValueChange(value);
        },
    });

    const [tableState, setTableState] = React.useState<DataTableState>({ sorting: [{ field: 'order' }] });

    const dataSource = useArrayDataSource<ProjectReport, number, DataQueryFilter<ProjectReport>>({
        items: Object.values(value.items),
        getId: i => i.id,
        getParentId: i => i.parentId,
    }, []);

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowOptions: (task) => ({ ...lens.prop('items').prop(task.id).toProps() }),
    });

    const columns = useMemo(() => getColumns(), []);

    const onCopy = (copyFrom: SelectedCellData, selectedCells: SelectedCellData[]) => {
        const valueToCopy = copyFrom.row.value?.[copyFrom.column.key as Day];
        const newItems = { ...value.items };
        for (const cell of selectedCells) {
            const cellRowId = cell.row.value.id;
            newItems[cellRowId] = { ...newItems[cellRowId], [cell.column.key]: valueToCopy };
        }

        onValueChange({ ...value, items: newItems });
    };

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                headerTextCase='upper'
                onCopy={ onCopy }
                getRows={ dataView.getVisibleRows }
                columns={ columns }
                value={ tableState }
                onValueChange={ setTableState }
                { ...dataView.getListProps() }
            />
        </Panel>
    );
}
