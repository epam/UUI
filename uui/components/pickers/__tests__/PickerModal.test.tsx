import React, { useCallback, useContext, useState } from 'react';
import { PickerModalTestObject, act, fireEvent, renderSnapshotWithContextAsync, screen, setupComponentForTest, waitFor, delayAct } from '@epam/uui-test-utils';
import { PickerModal, PickerModalProps } from '../PickerModal';
import { mockDataSource, mockDataSourceAsync, mockEmptyDataSource, mockSmallDataSource, mockSmallDataSourceAsync, mockTreeLikeDataSourceAsync, TestItemType, TestTreeItem } from './mocks';
import { Button, Modals } from '@epam/uui-components';
import { CascadeSelection, UuiContext } from '@epam/uui-core';

const onValueChangeMock = jest.fn();

async function setupPickerModalForTest<TItem = TestItemType, TId = number>(params: Partial<PickerModalProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerModalProps<TItem, TId>>(
        (): PickerModalProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    initialValue: params.initialValue as TId,
                    selectionMode: 'single',
                }, params) as PickerModalProps<TItem, TId>;
            }

            return Object.assign({
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                initialValue: params.initialValue as number[],
                selectionMode: 'multi',
            }, params) as PickerModalProps<TItem, TId>;
        },
        (props) => {
            const [initialValue, onValueChange] = useState<any>(props.initialValue);
            const context = useContext(UuiContext);

            const handleModalOpening = useCallback(() => {
                context.uuiModals
                    .show((modalProps) => {
                        return (
                            <PickerModal
                                { ...modalProps }
                                { ...props }
                                dataSource={ props.dataSource }
                                initialValue={ initialValue }
                            />
                        );
                    })
                    .then((newSelection) => {
                        act(() => {
                            onValueChange(newSelection as any);
                            onValueChangeMock(newSelection);
                        });
                    })
                    .catch(() => {});
            }, [context.uuiModals, initialValue]);

            return (
                <>
                    <Button onClick={ handleModalOpening }></Button>
                    <Modals />
                </>
            );
        },
    );
    const toggler = screen.getAllByRole('button')[0] as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { toggler, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

describe('PickerModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockSmallDataSource }
                getName={ (item) => item?.name ?? '' }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="single"
                initialValue={ null }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="multi"
                initialValue={ [] }
                getName={ (item) => item?.level ?? '' }
                filter={ { level: 'A1' } }
                sorting={ { direction: 'desc', field: 'level' } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { dom, result } = await setupPickerModalForTest<TestItemType, number>({
            selectionMode: 'single',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        fireEvent.click(dom.toggler);

        await PickerModalTestObject.waitForOptionsToBeReady();

        expect(result.baseElement).toMatchSnapshot();
    });

    describe('[selectionMode single]', () => {
        it('[valueType id] should select', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(PickerModalTestObject.getDialog()).toBeInTheDocument();
            const optionC2_1 = await screen.findByText('C2');
            fireEvent.click(optionC2_1);

            await PickerModalTestObject.closeModal();
            expect(PickerModalTestObject.queryDialog()).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(PickerModalTestObject.getDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findSelectedOption()).toBeUndefined();

            // should be selected and found after next opening the modal
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);

            await PickerModalTestObject.clickSelectItems();

            expect(PickerModalTestObject.queryDialog()).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(PickerModalTestObject.getDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const checkedOption = await PickerModalTestObject.findSelectedOption();
            expect(checkedOption).toEqual('C2');
        });

        it('[valueType entity] should select', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                valueType: 'entity',
                getName: ({ level }) => level,
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const optionC2_1 = await screen.findByText('C2');
            fireEvent.click(optionC2_1);

            await PickerModalTestObject.closeModal();
            expect(PickerModalTestObject.queryDialog()).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findSelectedOption()).toBeUndefined();

            // should be selected and found after next opening the modal
            const optionC2 = await screen.findByText('A1');
            fireEvent.click(optionC2);
            const checkedOption = await PickerModalTestObject.findSelectedOption();
            expect(checkedOption).toEqual('A1');

            await PickerModalTestObject.clickSelectItems();

            expect(PickerModalTestObject.queryDialog()).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const checkedOption1 = await PickerModalTestObject.findSelectedOption();
            expect(checkedOption1).toEqual('A1');
        });

        it.each<[CascadeSelection]>(
            [[false], [true], ['implicit'], ['explicit']],
        )
        ('should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
            const { dom } = await setupPickerModalForTest<TestTreeItem, number>({
                getName: ({ name }) => name,
                selectionMode: 'single',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });
            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            // Check parent
            await PickerModalTestObject.clickOptionByText('Parent 2');
            await PickerModalTestObject.clickSelectItems();
            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith(2);
            });
        });
    });

    describe('[selectionMode multi]', () => {
        it('[valueType id] should select & clear option', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            await PickerModalTestObject.clickOptionCheckbox('A1');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1']);

            await PickerModalTestObject.clickSelectItems();
            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);
            });

            fireEvent.click(dom.toggler);

            await PickerModalTestObject.clickOptionCheckbox('A1+');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            await PickerModalTestObject.clickSelectItems();
            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 3]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            await PickerModalTestObject.clickOptionCheckbox('A1+');

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1']);
        });

        it('[valueType entity] should select & clear several options', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                valueType: 'entity',
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickOptionCheckbox('A1');
            await PickerModalTestObject.clickOptionCheckbox('A1+');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([
                    { id: 2, level: 'A1', name: 'Elementary' },
                    { id: 3, level: 'A1+', name: 'Elementary+' },
                ]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            await PickerModalTestObject.clickOptionCheckbox('A1');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1+']);

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([
                    { id: 3, level: 'A1+', name: 'Elementary+' },
                ]);
            });
        });

        it('should pick single element with cascadeSelection = false', async () => {
            const { dom } = await setupPickerModalForTest<TestTreeItem, number>({
                selectionMode: 'multi',
                cascadeSelection: false,
                dataSource: mockTreeLikeDataSourceAsync,
                getName: ({ name }) => name,
            });
            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.hasOptions()).toBeTruthy();

            await PickerModalTestObject.clickOptionCheckbox('Parent 2');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Parent 2']);

            await PickerModalTestObject.clickSelectItems();
            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);
            });

            fireEvent.click(dom.toggler);

            await PickerModalTestObject.waitForOptionsToBeReady();
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Parent 2']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);
        });

        it.each<[CascadeSelection]>(
            [[true], ['explicit']],
        )
        ('should pick multiple elements with cascadeSelection = %s', async (cascadeSelection) => {
            const { dom } = await setupPickerModalForTest<TestTreeItem, number>({
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            // Check parent
            await PickerModalTestObject.clickOptionCheckbox('Parent 2');
            await delayAct(1); // wait react update

            // Unfold parent
            await PickerModalTestObject.clickOptionUnfold('Parent 2');

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 2.1, 2.2, 2.3]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            await PickerModalTestObject.clickOptionUnfold('Parent 2');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // // Check child
            await PickerModalTestObject.clickOptionCheckbox('Child 2.2');
            await delayAct(1); // wait react update

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2.1, 2.3]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickOptionUnfold('Parent 2');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should pick single element with cascadeSelection = implicit', async () => {
            const { dom } = await setupPickerModalForTest<TestTreeItem, number>({
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: 'implicit',
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            // Check parent
            await PickerModalTestObject.clickOptionCheckbox('Parent 2');
            // Unfold parent
            await PickerModalTestObject.clickOptionUnfold('Parent 2');
            await PickerModalTestObject.clickSelectItems();
            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickOptionUnfold('Parent 2');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerModalTestObject.clickOptionCheckbox('Child 2.2');
            await delayAct(1); // wait react update

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2.1, 2.3]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickOptionUnfold('Parent 2');
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should select all', async () => {
            const { dom } = await setupPickerModalForTest({
                initialValue: [],
                selectionMode: 'multi',
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickSelectAllOptions();
            await delayAct(1); // wait react update

            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(
                ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'],
            );

            await PickerModalTestObject.clickClearAllOptions();
            await delayAct(1); // wait react update

            await PickerModalTestObject.clickSelectItems();

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            expect(await PickerModalTestObject.findCheckedOptions()).toEqual([]);
        });

        it('should show only selected', async () => {
            const { dom } = await setupPickerModalForTest<TestItemType, number>({
                initialValue: [4, 2, 6, 8],
                selectionMode: 'multi',
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A2', 'B1', 'B2']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+', 'B1+', 'B2+', 'C1', 'C1+', 'C2']);

            await PickerModalTestObject.clickShowOnlySelected();

            await waitFor(async () => {
                expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
            });

            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual([]);
            await PickerModalTestObject.clickSelectItems();

            await waitFor(() => {
                expect(onValueChangeMock).toHaveBeenLastCalledWith([4, 2, 6, 8]);
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();
            await PickerModalTestObject.clickShowOnlySelected();
            await waitFor(async () => {
                expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
            });

            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual([]);
        });

        it('should be disabled "Show only selected" when search field do not empty', async () => {
            const { dom } = await setupPickerModalForTest<TestItemType, number>({
                initialValue: [4, 2, 6, 8],
                selectionMode: 'multi',
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A2', 'B1', 'B2']);
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+', 'B1+', 'B2+', 'C1', 'C1+', 'C2']);

            const searchInput = await PickerModalTestObject.findSearchInput();

            fireEvent.change(searchInput, { target: { value: 'A' } });

            await delayAct(500);

            await waitFor(async () => {
                expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A2']);
            }, { timeout: 200 });
            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+']);

            await PickerModalTestObject.clickShowOnlySelected();

            await waitFor(async () => {
                expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A2']);
            });

            expect(await PickerModalTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+']);
        });
    });

    describe('[Clear button functionality]', () => {
        it('should render clear button in single mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                initialValue: 2,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const clearButton = screen.getByRole('button', { name: /clear/i });
            expect(clearButton).toBeInTheDocument();
        });

        it('should render clear button in multi mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                initialValue: [2, 3],
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const clearButton = screen.getByRole('button', { name: /clear all/i });
            expect(clearButton).toBeInTheDocument();
        });

        it('should disable clear button when searching in single mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                initialValue: 2,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const searchInput = await PickerModalTestObject.findSearchInput();
            fireEvent.change(searchInput, { target: { value: 'test' } });

            await delayAct(500);

            const clearButton = screen.getAllByRole('button', { name: /clear/i })[1];
            expect(clearButton).toHaveAttribute('aria-disabled', 'true');
        });

        it('should disable clear button when no selection and no rows in single mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                initialValue: null,
                dataSource: mockEmptyDataSource,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            const clearButton = screen.queryByRole('button', { name: /clear/i });
            expect(clearButton).toHaveAttribute('aria-disabled', 'true');
        });

        it('should disable clear button when searching in multi mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                initialValue: [2, 3],
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const searchInput = await PickerModalTestObject.findSearchInput();
            fireEvent.change(searchInput, { target: { value: 'test' } });

            await delayAct(500);

            const clearButton = screen.getByRole('button', { name: /clear all/i });
            expect(clearButton).toHaveAttribute('aria-disabled', 'true');
        });

        it('should disable clear button when no selection and no rows in multi mode', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                initialValue: [],
                dataSource: mockSmallDataSourceAsync,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await delayAct(100);

            const clearButton = screen.queryByRole('button', { name: /clear/i });
            expect(clearButton).toBeNull();
        });

        it('should clear selection when clear button is clicked', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                initialValue: [2, 3],
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            const clearButton = screen.getByRole('button', { name: /clear all/i });
            fireEvent.click(clearButton);

            await delayAct(1);

            expect(await PickerModalTestObject.findCheckedOptions()).toEqual([]);
        });

        it('should handle disableClear prop', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                initialValue: 2,
                disableClear: true,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.findDialog()).toBeInTheDocument();

            await PickerModalTestObject.waitForOptionsToBeReady();

            const clearButton = screen.queryByRole('button', { name: /clear/i });
            expect(clearButton).toBeNull();
        });
    });
});
