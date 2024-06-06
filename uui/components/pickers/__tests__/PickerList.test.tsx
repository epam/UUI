import React, { ReactNode } from 'react';
import {
    setupComponentForTest, fireEvent, PickerListTestObject, screen, within, waitFor,
} from '@epam/uui-test-utils';
import { Modals } from '@epam/uui-components';
import { PickerList, PickerListProps } from '../PickerList';
import { TestItemType, mockDataSource, mockDataSourceAsync, mockEmptyDataSource } from './mocks';

async function setupPickerListForTest<TItem = TestItemType, TId = number>(params: Partial<PickerListProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerListProps<TItem, TId>>(
        (context): PickerListProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    value: params.value as TId,
                    selectionMode: 'single',
                    maxDefaultItems: 5,
                    maxTotalItems: 10,
                }, params) as PickerListProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                value: params.value as number[],
                selectionMode: 'multi',
                maxDefaultItems: 5,
                maxTotalItems: 10,
            }, params) as PickerListProps<TItem, TId>;
        },
        (props) => (
            <>
                <PickerList { ...props } />
                <Modals />
            </>
        ),
    );

    return {
        setProps,
        result,
        mocks,
        dom: { container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

describe('PickerList', () => {
    it('should render with minimum props', async () => {
        const { result } = await setupPickerListForTest({
            value: null,
            onValueChange: jest.fn,
            selectionMode: 'single',
            dataSource: mockDataSource,
        });

        await PickerListTestObject.waitForOptionsToBeReady();
        expect(result.baseElement).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const { result } = await setupPickerListForTest({
            value: [2, 3],
            onValueChange: jest.fn,
            selectionMode: 'multi',
            dataSource: mockDataSource,
            size: '48',
            valueType: 'id',
            getName: (item) => item?.level ?? '',
            placeholder: 'Test placeholder',
            filter: (item: any) => item.level === 'A1',
            sorting: { direction: 'desc', field: 'level' },
            renderNotFound: () => null,
            renderFilter: (props) => <div>{props as unknown as ReactNode}</div>,
            renderFooter: (props) => <div>{props as unknown as ReactNode}</div>,
            noOptionsMessage: 'Not found',
            disallowClickOutside: true,
            maxDefaultItems: 20,
            maxTotalItems: 40,
            defaultIds: [2, 3],
        });
        await PickerListTestObject.waitForOptionsToBeReady();

        expect(result.baseElement).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { result } = await setupPickerListForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'single',
            dataSource: mockDataSourceAsync,
            getName: ({ name }) => name,
        });

        await PickerListTestObject.waitForOptionsToBeReady();

        const toggler = PickerListTestObject.getPickerToggler();
        fireEvent.click(toggler);

        await PickerListTestObject.waitForOptionsToBeReady('modal');
        await PickerListTestObject.waitForLoadingComplete('modal');

        expect(result.baseElement).toMatchSnapshot();
    });

    it('should render not found', async () => {
        const { result } = await setupPickerListForTest({
            selectionMode: 'single',
            renderNotFound: () => <div data-testid="not-found">Not found</div>,
        });

        await PickerListTestObject.waitForOptionsToBeReady();

        const toggler = PickerListTestObject.getPickerToggler();
        fireEvent.click(toggler);

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        const searchInput = await PickerListTestObject.findSearchInput();
        fireEvent.change(searchInput, { target: { value: 'Some unknown record' } });

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        await waitFor(() => expect(PickerListTestObject.queryOptions({ editMode: 'modal' })).toEqual([]));

        expect(within(result.baseElement).getByTestId('not-found')).toBeDefined();
    });

    it('should render no options message', async () => {
        const { result } = await setupPickerListForTest({
            selectionMode: 'single',
            noOptionsMessage: 'No options message',
            dataSource: mockEmptyDataSource,
        });
        expect(PickerListTestObject.queryOptions()).toEqual([]);

        expect(result.baseElement.textContent).toBe('No options message');
    });

    it('should render custom footer', async () => {
        await setupPickerListForTest({
            selectionMode: 'single',
            renderFooter: () => <div data-testid="custom-footer">Custom footer</div>,
        });

        await PickerListTestObject.waitForOptionsToBeReady();

        const toggler = PickerListTestObject.getPickerToggler();
        fireEvent.click(toggler);

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        const modal = PickerListTestObject.getDialog('modal');
        expect(within(modal).getByTestId('custom-footer')).toBeInTheDocument();
    });

    it('should disallowClickOutside', async () => {
        const { setProps } = await setupPickerListForTest({
            selectionMode: 'single',
            disallowClickOutside: false,
        });

        await PickerListTestObject.waitForOptionsToBeReady();

        const toggler = PickerListTestObject.getPickerToggler();
        fireEvent.click(toggler);

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        PickerListTestObject.clickOnModalBlocker();

        expect(PickerListTestObject.queryDialog('modal')).not.toBeInTheDocument();

        setProps({ disallowClickOutside: true });

        const toggler2 = PickerListTestObject.getPickerToggler();
        fireEvent.click(toggler2);

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        PickerListTestObject.clickOnModalBlocker();

        expect(PickerListTestObject.getDialog('modal')).toBeInTheDocument();
    });

    describe('[selectionMode single]', () => {
        it('[valueType id] should select', async () => {
            const { mocks } = await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
            });
            await PickerListTestObject.waitForOptionsToBeReady();

            const optionC2 = await screen.findByText('A2+');
            fireEvent.click(optionC2);

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(5);
            });

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            const toggler = PickerListTestObject.getPickerToggler();
            fireEvent.click(toggler);

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            const selectedOption = await PickerListTestObject.findSelectedOption({ editMode: 'modal' });
            expect(selectedOption).toBe('A2+');
        });

        it('[valueType entity] should select & clear option', async () => {
            const { mocks } = await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                valueType: 'entity',
            });
            await PickerListTestObject.waitForOptionsToBeReady();

            const optionC2 = await screen.findByText('A2+');
            fireEvent.click(optionC2);
            
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 5, level: 'A2+', name: 'Pre-Intermediate+' });
            });

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            const toggler = PickerListTestObject.getPickerToggler();
            fireEvent.click(toggler);

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            const selectedOption = await PickerListTestObject.findSelectedOption({ editMode: 'modal' });
            expect(selectedOption).toBe('A2+');
        });

        it('should render names of items by getName', async () => {
            const { mocks } = await setupPickerListForTest<TestItemType, number>({
                value: 3,
                selectionMode: 'single',
                getName: ({ name }) => name,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            const optionC2 = await screen.findByText('Elementary');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(2);
            });
        });

        it('should render entity name in picker toggler text', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getPickerToggler().textContent?.trim().toLowerCase())
                .toEqual('show all 11 language levels');
        });

        it('should use plural entity name in toggler text', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Levels',
                entityPluralName: 'Multiple Language Levels',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getPickerToggler().textContent?.trim().toLowerCase())
                .toEqual('show all 11 multiple language levels');
        });

        it('should render 10 items by default', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                maxDefaultItems: undefined,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getOptions()).toHaveLength(10);
        });

        it('should render items count of maxDefaultItems', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                maxDefaultItems: 11,
                maxTotalItems: 20,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getOptions()).toHaveLength(11);
        });

        it('should render items count of maxTotalItems, if they are less then maxDefaultItems', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'single',
                maxDefaultItems: 11,
                maxTotalItems: 5,
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            expect(PickerListTestObject.getOptions()).toHaveLength(5);
        });

        it('should render items count of maxDefaultItems if item is selected', async () => {
            await setupPickerListForTest({
                value: 2,
                selectionMode: 'single',
                maxDefaultItems: 5,
                maxTotalItems: 6,
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            await waitFor(() => {
                const options = PickerListTestObject.getOptions();
                expect(options).toHaveLength(5);
            });

            const options = PickerListTestObject.getOptions();
            expect((within(options[0]).getByRole('radio') as HTMLInputElement).checked).toBeTruthy();
        });

        it('should apply sorting', async () => {
            await setupPickerListForTest({
                selectionMode: 'single',
                sorting: { direction: 'desc', field: 'level' },
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            
            await waitFor(() => {
                const options = PickerListTestObject.getOptions();
                expect(options.map((opt) => opt.textContent?.trim())).toEqual([
                    'C2',
                    'C1+',
                    'C1',
                    'B2+',
                    'B2',
                ]);
            });
        });

        it('should render defaultIds', async () => {
            await setupPickerListForTest({
                value: 6,
                selectionMode: 'single',
                sorting: { direction: 'desc', field: 'level' },
                defaultIds: [2, 3],
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            const options = PickerListTestObject.getOptions();
            expect(options).toHaveLength(3);
            expect(options.map((opt) => opt.textContent?.trim())).toEqual([
                'B1',
                'A1+',
                'A1',
            ]);
        });
    });

    describe('[selectionMode multi]', () => {
        it('[valueType id] should select & clear several options', async () => {
            const { mocks } = await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            await PickerListTestObject.clickOptionCheckbox('A1');
            
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            await PickerListTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });

            expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            const toggler = PickerListTestObject.getPickerToggler();
            fireEvent.click(toggler);

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            const checkedOptions1 = await PickerListTestObject.findCheckedOptions({ editMode: 'modal' });
            expect(checkedOptions1).toEqual(['A1', 'A1+']);

            await PickerListTestObject.clickOptionCheckbox('A1+', { editMode: 'modal' });
            await waitFor(async () => {
                const checkedOptions2 = await PickerListTestObject.findCheckedOptions({ editMode: 'modal' });
                expect(checkedOptions2).toEqual(['A1']);
            });
        });

        it('[valueType entity] should select & clear several options', async () => {
            const { mocks } = await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                valueType: 'entity',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            await PickerListTestObject.clickOptionCheckbox('A1');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([{
                    id: 2,
                    level: 'A1',
                    name: 'Elementary',
                }]);
            });

            await PickerListTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([
                    { id: 2, level: 'A1', name: 'Elementary' },
                    { id: 3, level: 'A1+', name: 'Elementary+' },
                ]);
            });

            expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            const toggler = PickerListTestObject.getPickerToggler();
            fireEvent.click(toggler);

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            const checkedOptions1 = await PickerListTestObject.findCheckedOptions({ editMode: 'modal' });
            expect(checkedOptions1).toEqual(['A1', 'A1+']);

            await PickerListTestObject.clickOptionCheckbox('A1+', { editMode: 'modal' });

            await waitFor(async () => {
                const checkedOptions2 = await PickerListTestObject.findCheckedOptions({ editMode: 'modal' });
                expect(checkedOptions2).toEqual(['A1']); 
            });
        });

        it('should render names of items by getName', async () => {
            await setupPickerListForTest<TestItemType, number>({
                value: [3, 4],
                selectionMode: 'multi',
                getName: ({ name }) => name,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            const checkedOptions1 = await PickerListTestObject.findCheckedOptions();
            expect(checkedOptions1).toEqual(['Elementary+', 'Pre-Intermediate']);
        });

        it('should render entity name in picker toggler text', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getPickerToggler().textContent?.trim().toLowerCase())
                .toEqual('show all 11 language levels');
        });

        it('should ignore plural entity name in placeholder', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Levels',
                entityPluralName: 'Multiple Language Levels',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getPickerToggler().textContent?.trim().toLowerCase())
                .toEqual('show all 11 multiple language levels');
        });

        it('should render 10 items by default', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                maxDefaultItems: undefined,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getOptions()).toHaveLength(10);
        });

        it('should render items count of maxDefaultItems', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                maxDefaultItems: 11,
                maxTotalItems: 20,
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            expect(PickerListTestObject.getOptions()).toHaveLength(11);
        });

        it('should render items count of maxTotalItems, if they are less then maxDefaultItems', async () => {
            await setupPickerListForTest({
                value: undefined,
                selectionMode: 'multi',
                maxDefaultItems: 11,
                maxTotalItems: 5,
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            expect(PickerListTestObject.getOptions()).toHaveLength(5);
        });

        it('should render up to maxTotalItems elements, if they are checked', async () => {
            await setupPickerListForTest({
                value: [2, 3, 4],
                selectionMode: 'multi',
                maxDefaultItems: 1,
                maxTotalItems: 4,
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            const options1 = PickerListTestObject.getOptions();
            expect(options1).toHaveLength(3);

            const options2 = await PickerListTestObject.findCheckedOptions();
            expect(options2).toHaveLength(3);
        });

        it('should render maxTotalItems elements, if amount of checked elements is more than maxTotalItems', async () => {
            await setupPickerListForTest({
                value: [2, 3, 4, 5, 6],
                selectionMode: 'multi',
                maxDefaultItems: 1,
                maxTotalItems: 4,
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            const options1 = PickerListTestObject.getOptions();
            expect(options1).toHaveLength(4);

            const options2 = await PickerListTestObject.findCheckedOptions();
            expect(options2).toHaveLength(4);
        });

        it('should select all', async () => {
            await setupPickerListForTest({
                value: [],
                selectionMode: 'multi',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            fireEvent.click(PickerListTestObject.getPickerToggler());

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            await PickerListTestObject.clickSelectAllOptions({ editMode: 'modal' });
            await waitFor(async () => {
                expect(await PickerListTestObject.findCheckedOptions({ editMode: 'modal' }))
                    .toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);
            });

            await PickerListTestObject.clickClearAllOptions({ editMode: 'modal' });
            await waitFor(async () => {
                expect(await PickerListTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual([]);
            });
        });

        it('should show only selected', async () => {
            await setupPickerListForTest<TestItemType, number>({
                value: [4, 2, 6, 8],
                selectionMode: 'multi',
            });

            await PickerListTestObject.waitForOptionsToBeReady();

            await waitFor(() => {
                expect(PickerListTestObject.getPickerToggler()).toBeInTheDocument();
            });

            fireEvent.click(PickerListTestObject.getPickerToggler());

            await PickerListTestObject.waitForOptionsToBeReady('modal');

            await waitFor(async () => {
                expect(await PickerListTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['A1', 'A2', 'B1', 'B2']);
            });
            expect(await PickerListTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['A1+', 'A2+', 'B1+', 'B2+', 'C1', 'C1+', 'C2']);

            await PickerListTestObject.clickShowOnlySelected({ editMode: 'modal' });

            await waitFor(async () => {
                expect(await PickerListTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['A2', 'A1', 'B1', 'B2']);
            });

            expect(await PickerListTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual([]);
        });

        it('should render defaultIds', async () => {
            await setupPickerListForTest({
                value: [6, 5],
                selectionMode: 'multi',
                sorting: { direction: 'desc', field: 'level' },
                defaultIds: [3, 2],
            });

            await PickerListTestObject.waitForOptionsToBeReady();
            const options = PickerListTestObject.getOptions();
            expect(options).toHaveLength(4);
            expect(options.map((opt) => opt.textContent?.trim())).toEqual([
                'B1', 'A2+', 'A1+', 'A1',
            ]);
        });
    });
});
