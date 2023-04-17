import { FiltersPanel } from '../FiltersPanel';
import { ArrayDataSource, DataColumnProps, TableFiltersConfig, useTableState } from "@epam/uui-core";
import { defaultPredicates } from "../defaultPredicates";
import { setupComponentForTest, screen, fireEvent, within } from "@epam/test-utils";
import React, { useState } from "react";
import dayjs from 'dayjs';

const TODAY_DAY_OF_MONTH = dayjs().date().toString();
const TODAY_DATE_ISO = dayjs().toISOString().split('T')[0]; // should be "YYYY-MM-DD"
const TODAY_DATE_FORMATTED = dayjs().format('MMM DD, YYYY');

type TestItemType = {
    name: string;
    status: number;
    position: number;
    age: number;
    hireDate: number;
    exitDate: number;
};

const columns: DataColumnProps<TestItemType, number>[] = [
    {
        key: 'name',
        caption: "Name",
        render: p => p.name,
        width: 100,
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'status',
        caption: 'Status',
        render: p => p.status,
        width: 100,
        isSortable: true,
        isFilterActive: f => f.status != null,
    },
    {
        key: 'age',
        caption: 'Age',
        render: p => p.age,
        width: 100,
        isSortable: true,
        isFilterActive: f => f.age != null,
    },
    {
        key: 'position',
        caption: 'Position',
        render: p => p.position,
        width: 100,
        isSortable: true,
        isFilterActive: f => f.position != null,
    },
    {
        key: 'hireDate',
        caption: 'Hire Date',
        render: p => p.hireDate,
        width: 100,
        isSortable: true,
        isFilterActive: f => f.hireDate != null,
    },
    {
        key: 'exitDate',
        caption: 'Exit Date',
        render: p => p.exitDate,
        width: 100,
        isSortable: true,
        isFilterActive: f => f.exitDate != null,
    },
];

const filtersConfigWithoutPredicatesAll: TableFiltersConfig<TestItemType>[] = [
    {
        field: "status",
        columnKey: "status",
        title: "Status",
        type: "singlePicker",
        dataSource: new ArrayDataSource({ items: [{id: 1, name: 'Green'}, {id: 2, name: 'Red'}, {id: 3, name: 'White'}] }),
    },
    {
        field: "position",
        columnKey: "position",
        title: "Position",
        type: "multiPicker",
        dataSource: new ArrayDataSource({ items: [{id: 1, name: 'Designer'}, {id: 2, name: 'QA'}, {id: 3, name: 'Dev'}] }),
    },
    {
        field: "age",
        columnKey: "age",
        title: "Age",
        type: "numeric",
    },
    {
        field: "hireDate",
        columnKey: "hireDate",
        title: "Hire Date",
        type: "rangeDatePicker",
    },
    {
        field: "exitDate",
        columnKey: "exitDate",
        title: "Exit Date",
        type: "datePicker",
    },
];

const filtersConfigWithPredicatesAll: TableFiltersConfig<TestItemType>[] = [
    {
        field: "position",
        columnKey: "position",
        title: "Position",
        type: "multiPicker",
        predicates: defaultPredicates.multiPicker,
        dataSource: new ArrayDataSource({ items: [{id: 1, name: 'Designer'}, {id: 2, name: 'QA'}, {id: 3, name: 'Dev'}] }),
    },
    {
        field: "age",
        columnKey: "age",
        title: "Age",
        type: "numeric",
        predicates: defaultPredicates.numeric,
    },
    {
        field: "hireDate",
        columnKey: "hireDate",
        title: "Hire Date",
        type: "rangeDatePicker",
        predicates: defaultPredicates.rangeDatePicker,
    },
];

async function setupFilterPanelComponent({ filtersConfig }: { filtersConfig: TableFiltersConfig<TestItemType>[] }) {
    type TestComponentWrapperProps = {
        onSetTableState: (state: any) => void;
        filters: TableFiltersConfig<TestItemType>[];
    };
    function TestComponentWrapper(props: TestComponentWrapperProps) {
        const [value, setValue] = useState({});
        const { tableState, setTableState } = useTableState({
            columns,
            filters: props.filters,
            onValueChange: setValue,
            value,
        });
        return (
            <FiltersPanel<TestItemType>
                filters={ props.filters }
                tableState={ tableState }
                setTableState={ (newState) => { setTableState(newState); props.onSetTableState(newState); }  }
            />
        );
    }

    const { result, mocks } = await setupComponentForTest<TestComponentWrapperProps>(
        () => {
            return {
                filters: filtersConfig,
                onSetTableState: jest.fn(),
            };
        },
        (props) => (<TestComponentWrapper filters={ props.filters } { ...props } />),
    );
    const dom = {
        add: screen.getByText('Add filter'),
    };
    return { result, dom, mocks };
}

function withinDialog() {
    return within(screen.queryByRole('dialog'));
}
function expectDialog() {
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
}
function notExpectDialog() {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('FiltersPanel', () => {
    describe('filter type: singlePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const statusOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Status' });
            expect(statusOption).toBeInTheDocument();
            fireEvent.click(statusOption);
            fireEvent.click(withinDialog().queryByRoleAndText({ role: 'option', text: 'Red' }));
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { status: 2 } }));
            fireEvent.click(screen.queryByRoleAndText({ role: 'button', text: 'Status:Red' }));
            expectDialog();
            expect(withinDialog().queryByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'true');
            fireEvent.click(withinDialog().queryAllByRole('button').find((btn) => btn.textContent === 'CLEAR'));
            expect(withinDialog().queryByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'false');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });

    describe('filter type: datePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const exitDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Exit Date' });
            expect(exitDateOption).toBeInTheDocument();
            fireEvent.click(exitDateOption);
            fireEvent.click(withinDialog().queryByText(TODAY_DAY_OF_MONTH));
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { exitDate: TODAY_DATE_ISO } }));
            fireEvent.click(screen.queryByRoleAndText({ role: 'button', text: `Exit Date:${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().queryByText(TODAY_DAY_OF_MONTH).parentElement).toHaveClass('uui-calendar-selected-day');
            fireEvent.click(withinDialog().queryAllByRole('button').find((btn) => btn.textContent === 'CLEAR'));
            expect(withinDialog().queryByText(TODAY_DAY_OF_MONTH).parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: multiPicker', () => {
        it('should add / view / clear / remove (without predicate)', () => {

        });
        it('should add / view / clear / remove (with multiPicker predicate)', () => {

        });
    });
    describe('filter type: numeric', () => {
        it('should add / view / clear / remove (without predicate)', () => {

        });
        it('should add / view / clear / remove (with numeric predicate)', () => {

        });
    });
    describe('filter type: rangeDatePicker', () => {
        it('should add / view / clear / remove (without predicate)', () => {

        });
        it('should add / view / clear / remove (with rangeDatePicker predicate)', () => {

        });
    });
});
