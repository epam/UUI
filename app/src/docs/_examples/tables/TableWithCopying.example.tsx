import React, { useMemo } from 'react';
import { DataQueryFilter, DataTableState, DataTableSelectedCellData, useArrayDataSource, DataColumnProps } from '@epam/uui-core';
import { DataTable, useForm, Panel, DataTableCell, NumericInput, TextInput } from '@epam/uui';

import css from './TablesExamples.module.scss';

enum Day {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
}

export interface ProjectReport extends Record<Day, number> {
    id: number;
    parentId?: number;
    name: string;
}

interface FormState {
    items: Record<number, ProjectReport>;
}

type SelectedCellData = DataTableSelectedCellData<ProjectReport, number, DataQueryFilter<ProjectReport>>;

export const projectReports: Partial<ProjectReport>[] = [
    { id: 1, name: 'Learn' }, { id: 2, name: 'Heroes' }, { id: 3, name: 'People' }, { id: 4, name: 'Assessment' }, { id: 5, name: 'Level Up' }, { id: 6, name: 'Grow' }, { id: 7, name: 'Time' }, { id: 8, name: 'Onboarding' }, { id: 9, name: 'Vacations' },
];

export const getDemoTasks = () => projectReports.reduce((acc, task) => ({ ...acc, [task.id]: task }), {});

const getWorkingDayColumn = (day: Day): DataColumnProps<ProjectReport, number, DataQueryFilter<ProjectReport>> => ({
    key: day,
    textAlign: 'center',
    caption: day,
    grow: 1,
    width: 73,
    canCopy: () => true,
    canAcceptCopy: (from, to) => from.row.id === to.row.id && ![Day.Saturday, Day.Sunday].includes(from.column.key as Day),

    renderCell: (props) => (
        <DataTableCell
            { ...props.rowLens.prop(day as Day).toProps() }
            renderEditor={ (props) => <NumericInput { ...props } formatOptions={ { maximumFractionDigits: 1 } } /> }
            { ...props }
        />
    ),
});

const getWeekendColumn = (day: Day): DataColumnProps<ProjectReport, number, DataQueryFilter<ProjectReport>> => ({
    key: day,
    textAlign: 'center',
    caption: day,
    width: 80,
    canCopy: () => false, // `canCopy` and `canAcceptCopy` functions can be undefined
    canAcceptCopy: () => false,
    renderCell: (props) => (
        <DataTableCell
            cx={ css.weekendDay }
            { ...props.rowLens.prop(day as Day).toProps() }
            renderEditor={ (props) => <NumericInput { ...props } formatOptions={ { maximumFractionDigits: 1 } } isDisabled={ true } /> }
            { ...props }
        />
    ),
});

function getColumns() {
    const columns: DataColumnProps<ProjectReport, number, DataQueryFilter<ProjectReport>>[] = [
        {
            key: 'name',
            caption: 'Project',
            width: 175,
            fix: 'left',
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('name').toProps() }
                    { ...props }
                    renderEditor={ (props) => <TextInput { ...props } /> }
                />
            ),
        },
        getWorkingDayColumn(Day.Monday),
        getWorkingDayColumn(Day.Tuesday),
        getWorkingDayColumn(Day.Wednesday),
        getWorkingDayColumn(Day.Thursday),
        getWorkingDayColumn(Day.Friday),
        getWeekendColumn(Day.Saturday),
        getWeekendColumn(Day.Sunday),
    ];

    return columns;
}

const savedValue: FormState = { items: getDemoTasks() };

export default function ProjectTimeReportDemo() {
    const { lens, value, onValueChange } = useForm<FormState>({
        value: savedValue,
        onSave: async (data) => {
            onValueChange(data);
        },
    });

    const [tableState, setTableState] = React.useState<DataTableState>({ sorting: [{ field: 'order' }] });

    const dataSource = useArrayDataSource<ProjectReport, number, DataQueryFilter<ProjectReport>>(
        {
            items: Object.values(value.items),
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
        },
        [],
    );

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
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                headerTextCase="upper"
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
