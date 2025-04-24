import { FiltersPanel, FiltersPanelProps } from '../FiltersPanel';
import { ArrayDataSource, TableFiltersConfig } from '@epam/uui-core';
import { defaultPredicates } from '../defaultPredicates';
import {
    setupComponentForTest, screen, within, userEvent, renderSnapshotWithContextAsync,
} from '@epam/uui-test-utils';
import React from 'react';
import dayjs from 'dayjs';

const now = dayjs();
const TODAY_DAY_OF_MONTH = now.date().toString();
const TODAY_DATE_ISO = now.format('YYYY-MM-DD');
const TODAY_DATE_FORMATTED = now.format('MMM DD, YYYY');

type TestItemType = {
    name: string;
    status: number;
    position: number;
    age: number;
    hireDate: number;
    exitDate: number;
};

const filtersConfigWithoutPredicatesAll: TableFiltersConfig<TestItemType>[] = [
    {
        field: 'status',
        columnKey: 'status',
        title: 'Status',
        type: 'singlePicker',
        dataSource: new ArrayDataSource({
            items: [
                { id: 1, name: 'Green' }, { id: 2, name: 'Red' }, { id: 3, name: 'White' },
            ],
        }),
        maxCount: 3,
    }, {
        field: 'position',
        columnKey: 'position',
        title: 'Position',
        type: 'multiPicker',
        dataSource: new ArrayDataSource({
            items: [
                { id: 1, name: 'Designer' }, { id: 2, name: 'QA' }, { id: 3, name: 'Dev' },
            ],
        }),
        togglerWidth: 400,
    }, {
        field: 'age',
        columnKey: 'age',
        title: 'Age',
        type: 'numeric',
    }, {
        field: 'hireDate',
        columnKey: 'hireDate',
        title: 'Hire Date',
        type: 'rangeDatePicker',
    }, {
        field: 'exitDate',
        columnKey: 'exitDate',
        title: 'Exit Date',
        type: 'datePicker',
    },
];

const filtersConfigWithPredicatesAll: TableFiltersConfig<TestItemType>[] = [
    {
        field: 'position',
        columnKey: 'position',
        title: 'Position',
        type: 'multiPicker',
        predicates: defaultPredicates.multiPicker,
        dataSource: new ArrayDataSource({
            items: [
                { id: 1, name: 'Designer' }, { id: 2, name: 'QA' }, { id: 3, name: 'Dev' },
            ],
        }),
    }, {
        field: 'age',
        columnKey: 'age',
        title: 'Age',
        type: 'numeric',
        predicates: defaultPredicates.numeric,
    }, {
        field: 'hireDate',
        columnKey: 'hireDate',
        title: 'Hire Date',
        type: 'rangeDatePicker',
        predicates: defaultPredicates.rangeDatePicker,
    },
];

async function setupFilterPanelComponent({ filtersConfig }: { filtersConfig: TableFiltersConfig<TestItemType>[] }) {
    const { result, mocks } = await setupComponentForTest<FiltersPanelProps<TestItemType>>(
        (contextRef) => {
            return {
                filters: filtersConfig,
                tableState: {},
                setTableState: jest.fn().mockImplementation((newTableState) => contextRef.current?.setProperty('tableState', newTableState)),
            };
        },
        (props) => <FiltersPanel { ...props } />,
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
    expect(screen.getByRole('dialog')).toBeInTheDocument();
}
function notExpectDialog() {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('FiltersPanel', () => {
    describe('snapshot', () => {
        it('should be rendered correctly', async () => {
            const tree = await renderSnapshotWithContextAsync(
                <FiltersPanel
                    filters={ filtersConfigWithoutPredicatesAll }
                    tableState={ {
                        filtersConfig: {
                            status: { isVisible: true, order: 'a' },
                            position: { isVisible: true, order: 'b' },
                            age: { isVisible: true, order: 'c' },
                            hireDate: { isVisible: true, order: 'd' },
                            exitDate: { isVisible: true, order: 'e' },
                        },
                        filter: {
                            status: [1, 2, 3],
                        },
                    } }
                    setTableState={ () => {} }
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('filter type: singlePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const statusOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Status' });
            expect(statusOption).toBeInTheDocument();
            await user.click(statusOption);
            await user.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' }));
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { status: 2 } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: 'Status:Red' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'true');

            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Red' })).toHaveAttribute('aria-selected', 'false');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });

    describe('filter type: datePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const exitDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Exit Date' });
            expect(exitDateOption).toBeInTheDocument();
            await user.click(exitDateOption);
            await user.click(withinDialog().getByText(TODAY_DAY_OF_MONTH));
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { exitDate: TODAY_DATE_ISO } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: `Exit Date:${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getByText(TODAY_DAY_OF_MONTH).parentElement).toHaveClass('uui-calendar-selected-day');
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getByText(TODAY_DAY_OF_MONTH).parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: multiPicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const positionOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Position' });
            expect(positionOption).toBeInTheDocument();
            await user.click(positionOption);
            await user.click(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' }));
            await user.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' }));
            await user.click(window.document.body);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { position: [2, 3] } }));
            await user.click(screen.getByRole('button', { name: 'Position: QA , Dev' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).toBeChecked();
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).not.toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).not.toBeChecked();
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with multiPicker predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const positionOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Position' });
            expect(positionOption).toBeInTheDocument();
            await user.click(positionOption);
            expect(
                withinDialog()
                    .queryAllByRole('tab')
                    .map((t) => t.textContent),
            ).toEqual(['is', 'is not']);
            await user.click(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' }));
            await user.click(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' }));
            await user.click(withinDialog().getByRoleAndText({ role: 'tab', text: 'is not' }));
            await user.click(window.document.body);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { position: { nin: [2, 3] } } }));
            await user.click(screen.getByRole('button', { name: 'Position is not QA , Dev' }));
            expectDialog();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).toBeChecked();
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR ALL' }));
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'QA' })).not.toBeChecked();
            expect(withinDialog().getByRoleAndText({ role: 'option', text: 'Dev' })).not.toBeChecked();
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: numeric', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const ageOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Age' });
            expect(ageOption).toBeInTheDocument();
            await user.click(ageOption);
            await user.type(withinDialog().getByRole('spinbutton'), '20');
            await user.click(window.document.body);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { age: 20 } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: 'Age:20' }));
            expectDialog();
            const input = withinDialog().getByRole('spinbutton') as HTMLInputElement;
            expect(input.placeholder).toEqual('20');
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(input.placeholder).toEqual('Enter a number');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with numeric predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const ageOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Age' });
            expect(ageOption).toBeInTheDocument();
            await user.click(ageOption);
            expect(
                withinDialog()
                    .queryAllByRole('tab')
                    .map((t) => t.textContent),
            ).toEqual([
                '=', '≠', '≤', '≥', 'In Range',
            ]);
            await user.type(withinDialog().getByRole('spinbutton'), '20');
            await user.click(withinDialog().getByRoleAndText({ role: 'tab', text: '≠' }));
            await user.click(window.document.body);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { age: { neq: 20 } } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: 'Age ≠20' }));
            expectDialog();
            const input = withinDialog().getByRole('spinbutton') as HTMLInputElement;
            expect(input.placeholder).toEqual('20');
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(input.placeholder).toEqual('Enter a number');
            const removeButton = withinDialog().queryByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
    describe('filter type: rangeDatePicker', () => {
        it('should add / view / clear / remove (without predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithoutPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const hireDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Hire Date' });
            expect(hireDateOption).toBeInTheDocument();
            await user.click(hireDateOption);
            await user.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            await user.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            await user.click(window.document.body);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { hireDate: { from: TODAY_DATE_ISO, to: TODAY_DATE_ISO } } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: `Hire Date:${TODAY_DATE_FORMATTED} - ${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).toHaveClass('uui-calendar-selected-day');
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
        it('should add / view / clear / remove (with rangeDatePicker predicate)', async () => {
            const user = userEvent.setup();
            const { dom, mocks } = await setupFilterPanelComponent({
                filtersConfig: filtersConfigWithPredicatesAll,
            });
            await user.click(dom.add);
            expectDialog();
            const hireDateOption = withinDialog().queryByRoleAndText({ role: 'option', text: 'Hire Date' });
            expect(hireDateOption).toBeInTheDocument();
            await user.click(hireDateOption);
            expect(
                withinDialog()
                    .queryAllByRole('tab')
                    .map((t) => t.textContent),
            ).toEqual(['In Range', 'Not in Range']);
            await user.click(withinDialog().getByRoleAndText({ role: 'tab', text: 'Not in Range' }));
            await user.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            await user.click(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0]);
            notExpectDialog();
            expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { hireDate: { notInRange: { from: TODAY_DATE_ISO, to: TODAY_DATE_ISO } } } }));
            await user.click(screen.getByRoleAndText({ role: 'button', text: `Hire Date Not in Range${TODAY_DATE_FORMATTED} - ${TODAY_DATE_FORMATTED}` }));
            expectDialog();
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).toHaveClass('uui-calendar-selected-day');
            await user.click(withinDialog().getByRoleAndText({ role: 'button', text: 'CLEAR' }));
            expect(withinDialog().getAllByText(TODAY_DAY_OF_MONTH)[0].parentElement).not.toHaveClass('uui-calendar-selected-day');
            const removeButton = withinDialog().getByRoleAndText({ role: 'button', text: 'REMOVE FILTER' });
            await user.click(removeButton);
            notExpectDialog();
            expect(screen.getByRoleAndText({ role: 'button', text: 'Add filter' })).toBeInTheDocument();
        });
    });
});
