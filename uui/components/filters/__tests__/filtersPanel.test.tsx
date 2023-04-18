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
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' }));
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { status: 2 } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: 'Status:Red' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'true');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'false');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
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
            fireEvent.click(withinDialog().getByText(TODAY_DAY_OF_MONTH));
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { exitDate: TODAY_DATE_ISO } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: `Exit Date:${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getByText(TODAY_DAY_OF_MONTH).parentElement).toHaveClass('uui-calendar-selected-day');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getByText(TODAY_DAY_OF_MONTH).parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: multiPicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const positionOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Position' });
            expect(positionOption).toBeInTheDocument();
            fireEvent.click(positionOption);
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' }));
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' }));
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { position: [2, 3] } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: 'Position:QA, Dev' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).toBeChecked();
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).not.toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).not.toBeChecked();
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with multiPicker predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const positionOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Position' });
            expect(positionOption).toBeInTheDocument();
            fireEvent.click(positionOption);
            expect(withinDialog().queryAllByRole('tab').map(t => t.textContent)).toEqual(['is', 'is not']);
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' }));
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' }));
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'tab', text: 'is not' }));
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { position: { nin: [2, 3] } } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: 'Position is notQA, Dev' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).toBeChecked();
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).not.toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).not.toBeChecked();
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: numeric', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const ageOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Age' });
            expect(ageOption).toBeInTheDocument();
            fireEvent.click(ageOption);
            fireEvent.change(withinDialog().getByRole('spinbutton'), { target: { value: 20 }});
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { age: 20 } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: 'Age:20' }));
            expectDialog();
            const input = withinDialog().getByRole('spinbutton') as HTMLInputElement;
            expect(input.placeholder).toEqual('20');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(input.placeholder).toEqual('Enter a number');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with numeric predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const ageOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Age' });
            expect(ageOption).toBeInTheDocument();
            fireEvent.click(ageOption);
            expect(withinDialog().queryAllByRole('tab').map(t => t.textContent)).toEqual(['=', '≠', '≤', '≥', 'In Range']);
            fireEvent.change(withinDialog().getByRole('spinbutton'), { target: { value: 20 }});
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'tab', text: '≠' }));
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { age: { neq: 20 } } }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: 'Age ≠20' }));
            expectDialog();
            const input = withinDialog().getByRole('spinbutton') as HTMLInputElement;
            expect(input.placeholder).toEqual('20');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(input.placeholder).toEqual('Enter a number');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: rangeDatePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const hireDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Hire Date' });
            expect(hireDateOption).toBeInTheDocument();
            fireEvent.click(hireDateOption);
            fireEvent.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            fireEvent.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { hireDate: { from: TODAY_DATE_ISO, to: TODAY_DATE_ISO }} }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: `Hire Date:${TODAY_DATE_FORMATTED} - ${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).toHaveClass('uui-calendar-selected-day');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with rangeDatePicker predicate)', async () => {
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            fireEvent.click(dom.add);
            expectDialog();
            const hireDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Hire Date' });
            expect(hireDateOption).toBeInTheDocument();
            fireEvent.click(hireDateOption);
            expect(withinDialog().queryAllByRole('tab').map(t => t.textContent)).toEqual(['In Range', 'Not in Range']);
            fireEvent.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            fireEvent.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'tab', text: 'Not in Range' }));
            fireEvent.click(window.document.body);
            notExpectDialog();
            expect(mocks.onSetTableState).lastCalledWith(expect.objectContaining({ filter: { hireDate: { notInRange: { from: TODAY_DATE_ISO, to: TODAY_DATE_ISO }}} }));
            fireEvent.click(screen.getByRoleAndText({ role: 'button', text: `Hire Date Not in Range${TODAY_DATE_FORMATTED} - ${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).toHaveClass('uui-calendar-selected-day');
            fireEvent.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            fireEvent.click(removeButton);
            notExpectDialog();
            expect(screen.queryByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
});
