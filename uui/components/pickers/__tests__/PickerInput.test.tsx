import React, { ReactNode } from 'react';
import { ArrayDataSource, CascadeSelection, LazyDataSource, PickerInputSearchPosition } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, waitFor, userEvent, PickerInputTestObject, act,
    delayAct,
} from '@epam/uui-test-utils';
import { Modals, PickerToggler } from '@epam/uui-components';
import { DataPickerRow, FlexCell, PickerItem, Text, Button } from '../../';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { IHasEditMode } from '../../types';
import { Item, TestItemType, TestTreeItem, mockDataSource, mockDataSourceAsync, mockSmallDataSourceAsync, mockTreeLikeDataSourceAsync } from './mocks';

type PickerInputComponentProps<TItem, TId> = PickerInputProps<TItem, TId>;

async function setupPickerInputForTest<TItem = TestItemType, TId = number>(params: Partial<PickerInputComponentProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerInputComponentProps<TItem, TId>>(
        (context): PickerInputComponentProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => {
                        if (typeof newValue === 'function') {
                            const v = newValue(params.value);
                            context.current?.setProperty('value', v);
                        }
                        context.current?.setProperty('value', newValue);
                    }),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    value: params.value as TId,
                    searchDebounceDelay: 0,
                }, params) as PickerInputComponentProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => {
                    if (typeof newValue === 'function') {
                        const v = newValue(params.value);
                        context.current?.setProperty('value', v);
                        return;
                    }
                    context.current?.setProperty('value', newValue);
                }),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                value: params.value as number[],
                selectionMode: 'multi',
                searchDebounceDelay: 0,
            }, params) as PickerInputComponentProps<TItem, TId>;
        },
        (props) => (
            <>
                <PickerInput { ...props } />
                <Modals />
            </>
        ),
    );
    const input = screen.queryByRole('textbox') as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { input, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

async function setupPickerInputForTestWithFirstValueChangeRewriting<TItem = TestItemType, TId = number>(
    params: Partial<PickerInputComponentProps<TItem, TId> & { valueForFirstUpdate: TItem | TId | TItem[] | TId[] }>,
) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerInputComponentProps<TItem, TId>>(
        (context): PickerInputComponentProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                let updatesCounter = 0;
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => {
                        if (updatesCounter === 0) {
                            updatesCounter++;
                            return context.current?.setProperty('value', params.valueForFirstUpdate);
                        }

                        if (typeof newValue === 'function') {
                            const v = newValue(params.value);
                            context.current?.setProperty('value', v);
                        }
                        context.current?.setProperty('value', newValue);
                    }),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    value: params.value as TId,
                    searchDebounceDelay: 0,
                }, params) as PickerInputComponentProps<TItem, TId>;
            }

            let updatesCounter = 0;
            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => {
                    if (updatesCounter === 0) {
                        updatesCounter++;
                        return context.current?.setProperty('value', params.valueForFirstUpdate);
                    }

                    if (typeof newValue === 'function') {
                        const v = newValue(params.value);
                        context.current?.setProperty('value', v);
                        return;
                    }
                    context.current?.setProperty('value', newValue);
                }),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                value: params.value as number[],
                selectionMode: 'multi',
                searchDebounceDelay: 0,
            }, params) as PickerInputComponentProps<TItem, TId>;
        },
        (props) => (
            <>
                <PickerInput { ...props } />
                <Modals />
            </>
        ),
    );
    const input = screen.queryByRole('textbox') as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { input, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

describe('PickerInput', () => {
    beforeEach(() => {
        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
            return {
                width: 0,
                height: 1,
                top: 0,
                left: 0,
            } as DOMRect;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput value={ null } onValueChange={ jest.fn } selectionMode="single" dataSource={ mockDataSource } disableClear searchPosition="input" />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput
                value={ [2, 3] }
                onValueChange={ jest.fn }
                selectionMode="multi"
                dataSource={ mockDataSource }
                size="48"
                maxItems={ 20 }
                editMode="modal"
                valueType="id"
                getName={ (item) => item?.level ?? '' }
                autoFocus
                placeholder="Test placeholder"
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
                searchPosition="body"
                minBodyWidth={ 900 }
                renderNotFound={ () => null }
                renderFooter={ (props) => <div>{ props as unknown as ReactNode }</div> }
                cascadeSelection
                dropdownHeight={ 48 }
                minCharsToSearch={ 4 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { dom, result } = await setupPickerInputForTest<Item, number>({
            value: undefined,
            selectionMode: 'single',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        fireEvent.click(dom.input);

        await PickerInputTestObject.waitForOptionsToBeReady();
        await PickerInputTestObject.waitForLoadingComplete();

        expect(result.baseElement).toMatchSnapshot();
    });

    describe('[selectionMode single]', () => {
        it('[valueType id] should select & clear option', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            });

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
            const clear = screen.getByRole('button');
            fireEvent.click(clear);
            await waitFor(() => {
                expect(screen.queryByText('C2')).not.toBeInTheDocument();
            });

            // double click should be performed to check, if on blur selection is still present
            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(screen.queryByText('C2')).not.toBeInTheDocument();

            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(screen.queryByText('C2')).not.toBeInTheDocument();
        });

        it('[valueType id] should listen to value change', async () => {
            const { dom, mocks } = await setupPickerInputForTestWithFirstValueChangeRewriting({
                selectionMode: 'single',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            });

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await waitFor(() => {
                expect(screen.queryByText('C2')).not.toBeInTheDocument();
            });

            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const option2C2 = await screen.findByText('C2');
            fireEvent.click(option2C2);

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            });
            await waitFor(() => {
                expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
            });
        });

        it('should close body on click outside', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            fireEvent.click(document.body);

            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
        });

        it('should keep selection on close body', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            });

            // double click should be performed to check, if on blur selection is still present
            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();

            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
        });

        it('[valueType entity] should select & clear option', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                valueType: 'entity',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 12, level: 'C2', name: 'Proficiency' });
            });
            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            await waitFor(() => {
                expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
            });

            const clear = screen.getByRole('button');
            fireEvent.click(clear);
            await waitFor(() => {
                expect(screen.queryByText('C2')).not.toBeInTheDocument();
            });
        });

        it('[valueType entity] should listen to value change', async () => {
            const { dom, mocks } = await setupPickerInputForTestWithFirstValueChangeRewriting({
                value: undefined,
                selectionMode: 'single',
                valueType: 'entity',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 12, level: 'C2', name: 'Proficiency' });
            });

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await waitFor(() => {
                expect(screen.queryByText('C2')).not.toBeInTheDocument();
            });

            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const option2C2 = await screen.findByText('C2');
            fireEvent.click(option2C2);

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 12, level: 'C2', name: 'Proficiency' });
            });
            await waitFor(() => {
                expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
            });
        });

        it('should render names of items by getName', async () => {
            const { mocks, dom } = await setupPickerInputForTest<TestItemType, number>({
                value: 3,
                selectionMode: 'single',
                getName: ({ name }) => name,
            });

            await waitFor(async () => expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Elementary+'));

            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            const optionC2 = await screen.findByText('Proficiency');
            fireEvent.click(optionC2);
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            });
        });

        it('should render entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
        });

        it('should ignore plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
        });

        it.each<[CascadeSelection]>(
            [[false], [true], ['implicit'], ['explicit']],
        )
        ('should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
            const { mocks, dom } = await setupPickerInputForTest<TestTreeItem, number>({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'single',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });
            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            // Check parent
            await PickerInputTestObject.clickOptionByText('Parent 2');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(2);
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Parent 2');
        });

        it('should work with maxItems properly', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 1,
                selectionMode: 'single',
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            // Check parent
            await PickerInputTestObject.clickOptionByText('A1');
            fireEvent.click(dom.input);
            await PickerInputTestObject.clickOptionByText('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(3);
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('A1+');
        });

        it('should disable clear', async () => {
            const { dom, setProps } = await setupPickerInputForTest({
                value: 2,
                selectionMode: 'single',
                disableClear: false,
            });

            await waitFor(() => expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('A1'));

            const clearButton = within(dom.container).getByRole('button', { name: 'Clear' });
            expect(clearButton).toBeInTheDocument();
            fireEvent.click(clearButton);
            await waitFor(() => {
                expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            });

            // After clearing of all the items, debounced version of clear search is called.
            // If update items just after clearing, handleDataSourceValueChange with old value will be called.
            // So, to wait for all debounced events execution, delayAct should be called.
            await delayAct();

            setProps({ disableClear: true, value: 2 });
            await waitFor(() => {
                expect(within(dom.container).queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('A1');
        });

        it('should clear selected item', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                maxItems: 100,
            });
            fireEvent.click(dom.input);

            expect(await PickerInputTestObject.hasOptions()).toBeTruthy();

            const clearButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
            expect(clearButton).toBeInTheDocument();
            expect(clearButton).toHaveAttribute('aria-disabled', 'true');

            await PickerInputTestObject.clickOptionByText('A1');
            await waitFor(() => {
                expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('A1');
            });

            fireEvent.click(dom.input);

            const clearButton2 = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
            expect(clearButton2).toHaveAttribute('aria-disabled', 'false');

            fireEvent.click(clearButton2);
            await waitFor(() => {
                expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            });

            const clearButton3 = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
            expect(clearButton3).toHaveAttribute('aria-disabled', 'true');
        });
    });

    describe('[selectionMode multi]', () => {
        it('[valueType id] should select & clear several options', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            await PickerInputTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);

            PickerInputTestObject.removeSelectedTagByText(dom.target, 'A1+');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1']);
            });

            PickerInputTestObject.removeSelectedTagByText(dom.target, 'A1');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
            });
        });

        it('[valueType id] should select & clear all', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            await PickerInputTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            await PickerInputTestObject.clickClearAllOptions();
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
            });

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
        });
        it('should close body on click outside', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
            });
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            await PickerInputTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should keep selection on close body', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
            });
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            await PickerInputTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            // double click should be performed to check, if on blur selection is still present
            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);

            fireEvent.click(document.body);
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull();
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);
        });

        it('[valueType id] should listen to value change', async () => {
            const { dom, mocks } = await setupPickerInputForTestWithFirstValueChangeRewriting({
                valueForFirstUpdate: [4],
                value: undefined,
                selectionMode: 'multi',
                valueType: 'id',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A2']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([4, 2]);
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A2', 'A1']);
        });

        it('[valueType entity] should listen to value change', async () => {
            const { dom, mocks } = await setupPickerInputForTestWithFirstValueChangeRewriting({
                valueForFirstUpdate: [{ id: 4, level: 'A2', name: 'Pre-Intermediate' }],
                value: undefined,
                selectionMode: 'multi',
                valueType: 'entity',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([{
                    id: 2,
                    level: 'A1',
                    name: 'Elementary',
                }]);
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A2']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await act(async () => {
                await PickerInputTestObject.clickOptionCheckbox('A1');
            });

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([{
                    id: 4,
                    level: 'A2',
                    name: 'Pre-Intermediate',
                },
                {
                    id: 2,
                    level: 'A1',
                    name: 'Elementary',
                }]);
            });
            expect(await PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A2', 'A1']);
        });

        it('[valueType entity] should select & clear several options', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                valueType: 'entity',
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputTestObject.clickOptionCheckbox('A1');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([{ id: 2, level: 'A1', name: 'Elementary' }]);
            });

            await PickerInputTestObject.clickOptionCheckbox('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([
                    { id: 2, level: 'A1', name: 'Elementary' },
                    { id: 3, level: 'A1+', name: 'Elementary+' },
                ]);
            });
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);

            PickerInputTestObject.removeSelectedTagByText(dom.target, 'A1+');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1']);
            });
            PickerInputTestObject.removeSelectedTagByText(dom.target, 'A1');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
            });
        });

        it('should render names of items by getName', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [3, 4],
                selectionMode: 'multi',
                getName: ({ name }) => name,
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            await waitFor(() => expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['Elementary+', 'Pre-Intermediate']));
        });

        it('should render entity name with \'s\' in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Levels');
        });

        it('should render plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });

            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select Multiple Language Levels');
        });

        it('should pick single element with cascadeSelection = false', async () => {
            const { mocks, dom } = await setupPickerInputForTest<TestTreeItem, number>({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: false,
                dataSource: mockTreeLikeDataSourceAsync,
            });
            fireEvent.click(dom.input);
            expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            await PickerInputTestObject.clickOptionCheckbox('Parent 2');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Parent 2']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['Parent 2']);
        });

        it.each<[CascadeSelection]>(
            [[true], ['explicit']],
        )
        ('should pick multiple elements with cascadeSelection = %s', async (cascadeSelection) => {
            const { mocks, dom } = await setupPickerInputForTest<TestTreeItem, number>({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.input);
            expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            // Check parent
            await PickerInputTestObject.clickOptionCheckbox('Parent 2');
            // Unfold parent
            await PickerInputTestObject.clickOptionUnfold('Parent 2');
            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 2.1, 2.2, 2.3]);
            });

            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerInputTestObject.clickOptionCheckbox('Child 2.2');
            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
            });

            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should pick single element with cascadeSelection = implicit', async () => {
            const { mocks, dom } = await setupPickerInputForTest<TestTreeItem, number>({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: 'implicit',
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.input);
            await waitFor(async () => {
                expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            });

            // Check parent
            await PickerInputTestObject.clickOptionCheckbox('Parent 2');
            // Unfold parent
            await PickerInputTestObject.clickOptionUnfold('Parent 2');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            });

            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['Parent 2']);

            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerInputTestObject.clickOptionCheckbox('Child 2.2');
            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
            });
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should wrap up extra items if number of elements is greater than maxItems', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 2,
                entityPluralName: 'languages',
                selectionMode: 'multi',
            });

            fireEvent.click(dom.input);
            await waitFor(async () => {
                expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            });

            // Check parent
            await PickerInputTestObject.clickOptionByText('A1');
            await PickerInputTestObject.clickOptionByText('A1+');
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            });
            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);

            await PickerInputTestObject.clickOptionByText('A2');
            await PickerInputTestObject.clickOptionByText('A2+');

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3, 4, 5]);
            });

            expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+', '+ 2']);
        });

        it('should disable clear', async () => {
            const { setProps, dom, result } = await setupPickerInputForTest({
                value: [2, 3],
                selectionMode: 'multi',
                disableClear: false,
            });
            await waitFor(() => expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']));
            PickerInputTestObject.clearInput(result.container);
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
            });

            setProps({ disableClear: true, value: [2, 3] });
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual(['A1', 'A1+']);
            });
            expect(PickerInputTestObject.hasClearInputButton(result.container)).toBeFalsy();
        });

        it('should select all', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                maxItems: 100,
            });

            fireEvent.click(dom.input);
            await waitFor(async () => {
                expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            });

            await PickerInputTestObject.clickSelectAllOptions();

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
                // expect(within(dialog).getByText('CLEAR ALL')).toBeInTheDocument();
            });

            await waitFor(() => {
                const result = PickerInputTestObject.getSelectedTagsText(dom.target);
                return expect(result).toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);
            });

            await PickerInputTestObject.clickClearAllOptions();
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([]);
            });
        });

        describe('show only selected', () => {
            it('should show only selected items', async () => {
                const { dom } = await setupPickerInputForTest<TestItemType, number>({
                    value: [4, 2, 6, 8],
                    selectionMode: 'multi',
                });

                fireEvent.click(dom.input);

                const dialog = await screen.findByRole('dialog');
                expect(dialog).toBeInTheDocument();

                await waitFor(async () => {
                    expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A2', 'B1', 'B2']);
                });

                expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+', 'B1+', 'B2+', 'C1', 'C1+', 'C2']);

                await PickerInputTestObject.clickShowOnlySelected();

                expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
                expect(await PickerInputTestObject.findUncheckedOptions()).toEqual([]);
            });
        });

        it('should show selected items by \'Show only selected\' click, and reset \'Show only selected\' mode by search change', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: undefined,
                selectionMode: 'multi',
                searchPosition: 'body',
                getSearchFields: (item) => [item!.level],
            });

            expect(dom.input.hasAttribute('readonly')).toBeTruthy();
            fireEvent.click(dom.input);

            const dialog = await screen.findByRole('dialog');
            expect(dialog).toBeInTheDocument();

            await PickerInputTestObject.waitForOptionsToBeReady();

            // Verify that all expected options are displayed.
            expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual([
                'A1',
                'A1+',
                'A2',
                'A2+',
                'B1',
                'B1+',
                'B2',
                'B2+',
                'C1',
                'C1+',
                'C2',
            ]);

            // Click on options 'A1' and 'B1' to select them.
            await PickerInputTestObject.clickOptionByText('A1');
            await PickerInputTestObject.clickOptionByText('B1');

            await PickerInputTestObject.clickShowOnlySelected();

            // Expect that only 'A1' and 'B1' are visible after the filter is applied.
            await waitFor(async () => expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual(['A1', 'B1']));

            // Type 'A' into the search input and trigger the search.
            const bodyInput = within(dialog).getByPlaceholderText('Search');
            fireEvent.change(bodyInput, { target: { value: 'A' } });

            // Expect that only options containing 'A' are shown after the search.
            await waitFor(() => expect(PickerInputTestObject.getOptions({ busy: false }).length).toBe(4));
            expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual(['A1', 'A1+', 'A2', 'A2+']);

            // Clear the search input and verify that all options are visible again.
            fireEvent.change(bodyInput, { target: { value: '' } });
            await waitFor(async () => expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual([
                'A1',
                'A1+',
                'A2',
                'A2+',
                'B1',
                'B1+',
                'B2',
                'B2+',
                'C1',
                'C1+',
                'C2',
            ]));
        });
    });

    it('should disable input', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            isDisabled: true,
        });

        expect(dom.input.hasAttribute('disabled')).toBeTruthy();
        expect(dom.input.getAttribute('aria-disabled')?.trim()).toEqual('true');

        fireEvent.click(dom.input);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should make an input readonly', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            isReadonly: true,
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        expect(dom.input.getAttribute('aria-readonly')?.trim()).toEqual('true');

        fireEvent.click(dom.input);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it.each<[IHasEditMode['mode'] | undefined]>(
        [[undefined], ['form'], ['cell'], ['inline']],
    )('should render with mode = %s', async (mode) => {
        const props: PickerInputComponentProps<TestItemType, number> = {
            value: [],
            onValueChange: () => {},
            valueType: 'id',
            dataSource: mockDataSourceAsync,
            disableClear: false,
            searchPosition: 'input',
            getName: (item: TestItemType) => item.level,
            selectionMode: 'multi',
            mode,
        };
        expect(await renderSnapshotWithContextAsync(<PickerInput { ...props } />)).toMatchSnapshot();
    });

    it.each<['left' | 'right' | undefined]>(
        [[undefined], ['left'], ['right']],
    )('should render icon at specific position', async (iconPosition) => {
        const props: PickerInputComponentProps<TestItemType, number> = {
            value: [],
            onValueChange: () => {},
            valueType: 'id',
            dataSource: mockDataSourceAsync,
            disableClear: false,
            searchPosition: 'input',
            getName: (item: TestItemType) => item.level,
            selectionMode: 'multi',
            icon: () => <div data-testid = "test-icon" />,
            iconPosition,
        };
        expect(await renderSnapshotWithContextAsync(<PickerInput { ...props } />)).toMatchSnapshot();
    });

    it('should pass onClick to the icon', async () => {
        const { mocks } = await setupPickerInputForTest({
            value: undefined,
            onIconClick: jest.fn(),
            icon: () => <div data-testid = "test-icon" />,
        });

        const iconContainer = screen.getByTestId('test-icon').parentElement as Element;
        fireEvent.click(iconContainer);
        expect(mocks.onIconClick).toBeCalledTimes(1);
    });

    it('should open dialog only when minCharsToSearch is reached', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            minCharsToSearch: 1,
        });

        fireEvent.click(dom.input);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        jest.useFakeTimers();
        fireEvent.change(dom.input, { target: { value: 'A' } });
        act(() => {
            jest.runAllTimers();
        });
        jest.useRealTimers();
        const pickerBody = await PickerInputTestObject.findDialog();
        return expect(pickerBody).toBeInTheDocument();
    });

    it('should use modal edit mode', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            editMode: 'modal',
        });
        fireEvent.click(dom.input);
        expect(screen.getByAria('modal', 'true')).toBeInTheDocument();

        expect(
            await PickerInputTestObject.findOptionsText({ busy: false, editMode: 'modal' }),
        ).toEqual(
            ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'],
        );
    });

    it('should render input as invalid', async () => {
        const props: PickerInputComponentProps<TestItemType, number | undefined> = {
            value: undefined,
            onValueChange: () => {},
            valueType: 'id',
            dataSource: mockDataSourceAsync,
            disableClear: false,
            searchPosition: 'input',
            getName: (item: TestItemType) => item.level,
            selectionMode: 'single',
            isInvalid: true,
        };
        expect(await renderSnapshotWithContextAsync(<PickerInput { ...props } />)).toMatchSnapshot();
    });

    it('should support single line', async () => {
        const props: PickerInputComponentProps<TestItemType, number> = {
            value: [],
            onValueChange: () => {},
            dataSource: mockDataSourceAsync,
            disableClear: false,
            searchPosition: 'input',
            getName: (item: TestItemType) => item.level,
            selectionMode: 'multi',
            isSingleLine: true,
        };
        expect(await renderSnapshotWithContextAsync(<PickerInput { ...props } />)).toMatchSnapshot();
    });

    it('should provide custom placeholder', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            placeholder: 'Custom placeholder',
        });
        expect(await PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Custom placeholder');
    });

    it('should define minBodyWidth', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            minBodyWidth: 300,
        });

        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const dialogBody = dialog.getElementsByClassName('uui-dropdown-body')[0];
        expect(dialogBody).toHaveStyle('min-width: 300px');
    });

    it('should define dropdownHeight', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            dropdownHeight: 100,
        });

        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const dialogBody = dialog.firstElementChild?.firstElementChild;
        expect(dialogBody).toHaveStyle('max-height: 100px');
    });

    it('should render custom toggler', async () => {
        const { mocks, dom } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            renderToggler: (props) => (
                <Button
                    rawProps={ {
                        ...props.rawProps,
                        'data-testid': 'test-toggler',
                    } }
                    size="36"
                    onClick={ props.onClick }
                    ref={ props.ref }
                    iconPosition="left"
                    fill="ghost"
                    caption={ props.selection?.map((s) => s.value?.name).join(', ') }
                />
            ),
        });

        expect(dom.target.getAttribute('type')).toBe('button');

        fireEvent.click(dom.target);
        await waitFor(async () => {
            expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
        });

        await PickerInputTestObject.clickOptionCheckbox('A1');
        await PickerInputTestObject.clickOptionCheckbox('A1+');
        await waitFor(async () => {
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
        });

        expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);
        expect(screen.getByTestId('test-toggler').textContent?.trim()).toEqual('Elementary, Elementary+');
    });

    it('Should render toggler without arrow icon', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            entityName: 'Language Level',
            searchPosition: 'input',
            renderToggler: () => <PickerToggler dropdownIcon={ () => <div data-testid = "arrow-icon" /> } pickerMode="single" searchPosition="none" closePickerBody={ () => {} } />,
            minCharsToSearch: 3,
        });

        expect(within(dom.container).queryByTestId('arrow-icon')).not.toBeInTheDocument();
    });

    it('Should render toggler with arrow icon', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            entityName: 'Language Level',
            renderToggler: () => <PickerToggler isDropdown dropdownIcon={ () => <div data-testid = "arrow-icon" /> } pickerMode="single" searchPosition="none" closePickerBody={ () => {} } />,
            minCharsToSearch: undefined,
        });

        expect(within(dom.container).getByTestId('arrow-icon')).toBeInTheDocument();
    });

    it('should render search in input', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'input',
        });

        expect(dom.input.getAttribute('readonly')).toBeNull();
        fireEvent.click(dom.input);
        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const bodyInput = within(dialog).queryByPlaceholderText('Search');
        expect(bodyInput).not.toBeInTheDocument();
    });

    it('should render search in body', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'body',
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        const bodyInput = within(dialog).getByPlaceholderText('Search');
        expect(bodyInput).toBeInTheDocument();
        expect(bodyInput.hasAttribute('readonly')).toBeFalsy();
    });

    it('should not render search in none mode', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'none',
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('should render custom not found', async () => {
        const mockEmptyDS = new ArrayDataSource<TestItemType, number, any>({
            items: [],
            getId: ({ id }) => id,
        });

        const mockConsoleError = jest.fn();
        const prevConsoleError = console.error;
        console.error = mockConsoleError;

        const customText = 'Custom Text or Component';

        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            dataSource: mockEmptyDS,
            renderNotFound: () => (
                <FlexCell grow={ 1 } textAlign="center" rawProps={ { 'data-testid': 'test-custom-not-found' } }>
                    <Text>{customText}</Text>
                </FlexCell>
            ),
        });

        fireEvent.click(dom.input);
        const notFound = within(await screen.findByRole('dialog')).getByTestId('test-custom-not-found');
        expect(notFound).toHaveTextContent(customText);
        expect(mockConsoleError).toBeCalled();

        console.error = prevConsoleError;
    });

    it('should not load items while search less than minCharsToSearch', async () => {
        const apiMock = jest.fn().mockResolvedValue([]);

        const mockEmptyDS = new LazyDataSource<TestItemType, number, any>({
            api: apiMock,
            getId: ({ id }) => id,
        });

        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            minCharsToSearch: 3,
            searchPosition: 'body',
            dataSource: mockEmptyDS,
            getSearchFields: (item) => [item!.level],
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        await waitFor(async () => {
            const notFound = within(await screen.findByRole('dialog'));
            expect(notFound.getByText('Type search to load items')).toBeInTheDocument();
        });

        expect(apiMock).toBeCalledTimes(0);

        const bodyInput = within(dialog).getByPlaceholderText('Search');

        jest.useFakeTimers();
        fireEvent.change(bodyInput, { target: { value: '1234' } });
        act(() => {
            jest.runAllTimers();
        });
        jest.useRealTimers();

        await waitFor(async () => {
            const notFound = within(await screen.findByRole('dialog'));
            expect(notFound.getByText('No records found')).toBeInTheDocument();
        });

        expect(apiMock).toBeCalledTimes(1);
    });

    it('should render custom renderEmpty', async () => {
        const mockEmptyDS = new ArrayDataSource<TestItemType, number, any>({
            items: [],
            getId: ({ id }) => id,
        });

        const customTextForNotFound = 'Custom Text For Not Found';
        const customTextForNotFoundId = 'test-custom-not-found-from-empty';
        const customTextForNotEnoughCharsInSearch = 'Custom Text For Not Enough Chars In Search';
        const customTextForNotEnoughCharsInSearchId = 'test-custom-not-enough-chars-from-empty';

        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            minCharsToSearch: 3,
            searchPosition: 'body',
            dataSource: mockEmptyDS,
            renderEmpty: ({ minCharsToSearch, search }) => {
                if (search.length < minCharsToSearch) {
                    return (
                        <FlexCell grow={ 1 } textAlign="center" rawProps={ { 'data-testid': customTextForNotEnoughCharsInSearchId } }>
                            <Text>{customTextForNotEnoughCharsInSearch}</Text>
                        </FlexCell>
                    );
                }

                return (
                    <FlexCell grow={ 1 } textAlign="center" rawProps={ { 'data-testid': customTextForNotFoundId } }>
                        <Text>{customTextForNotFound}</Text>
                    </FlexCell>
                );
            },
            getSearchFields: (item) => [item!.level],
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        await waitFor(async () => {
            const notFound = within(await screen.findByRole('dialog')).getByTestId(customTextForNotEnoughCharsInSearchId);
            expect(notFound).toHaveTextContent(customTextForNotEnoughCharsInSearch);
        });

        const bodyInput = within(dialog).getByPlaceholderText('Search');
        fireEvent.change(bodyInput, { target: { value: 'A11' } });

        await waitFor(async () => {
            const notFound = within(await screen.findByRole('dialog')).getByTestId(customTextForNotFoundId);
            expect(notFound).toHaveTextContent(customTextForNotFound);
        });
    });

    it('should render custom row', async () => {
        const { dom } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            renderRow: (props) => (
                <DataPickerRow
                    { ...props }
                    key={ props.rowKey }
                    alignActions="center"
                    renderItem={ (item, rowProps) => <PickerItem { ...rowProps } title={ item.name } /> }
                />
            ),
        });

        fireEvent.click(dom.input);
        expect(await screen.findByRole('dialog')).toBeInTheDocument();

        await PickerInputTestObject.waitForOptionsToBeReady();

        expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual([
            'Elementary',
            'Elementary+',
            'Pre-Intermediate',
            'Pre-Intermediate+',
            'Intermediate',
            'Intermediate+',
            'Upper-Intermediate',
            'Upper-Intermediate+',
            'Advanced',
            'Advanced+',
            'Proficiency',
        ]);
    });

    it('should search items', async () => {
        const { dom } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'body',
            getSearchFields: (item) => [item!.level],
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        await PickerInputTestObject.waitForOptionsToBeReady();

        expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual([
            'A1',
            'A1+',
            'A2',
            'A2+',
            'B1',
            'B1+',
            'B2',
            'B2+',
            'C1',
            'C1+',
            'C2',
        ]);

        const bodyInput = within(dialog).getByPlaceholderText('Search');
        fireEvent.change(bodyInput, { target: { value: 'A' } });

        await waitFor(() => expect(PickerInputTestObject.getOptions({ busy: false }).length).toBe(4));

        expect(await PickerInputTestObject.findOptionsText({ busy: false })).toEqual([
            'A1',
            'A1+',
            'A2',
            'A2+',
        ]);
    });

    describe('keyboard navigation', () => {
        let btn: Element;
        function addFocusableElementBefore() {
            const btnEl = document.createElement('button');
            document.body.prepend(btnEl);
            return btnEl;
        }

        beforeAll(() => {
            btn = addFocusableElementBefore();
        });

        const testInputFocus = async (selectionMode: 'single' | 'multi', searchPosition?: PickerInputSearchPosition) => {
            const user = userEvent.setup();
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode,
                searchPosition,
            });

            // click the button just before PickerInput
            await user.click(btn);
            // move to PickerInput by Tab key
            await user.tab();

            expect(dom.input).not.toHaveAttribute('readOnly');
            expect(dom.input).toEqual(document.activeElement);

            return user;
        };

        it('[selectionMode single] should focus input on Tab', async () => await testInputFocus('single'));

        it('[selectionMode multi] should focus input on Tab', async () => await testInputFocus('multi', 'input'));

        it('[selectionMode single] should open dropdown when start typing', async () => {
            const user = await testInputFocus('single');
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await user.keyboard('a');
            expect(await screen.findByRole('dialog')).toBeInTheDocument();
        });

        it('should focus on first item on open and then move focus by arrows', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: undefined,
                selectionMode: 'multi',
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            await waitFor(async () => {
                const dialog = await screen.findByRole('dialog');
                const focusedItem = dialog.querySelector('.uui-focus');
                expect(focusedItem!.getAttribute('aria-posinset')).toBe('1');
            });

            fireEvent.keyDown(dom.input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });

            await waitFor(async () => {
                const dialog = await screen.findByRole('dialog');
                const focusedItem = dialog.querySelector('.uui-focus');
                expect(focusedItem!.getAttribute('aria-posinset')).toBe('2');
            });

            fireEvent.keyDown(dom.input, { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });

            await waitFor(async () => {
                const dialog = await screen.findByRole('dialog');
                const focusedItem = dialog.querySelector('.uui-focus');
                expect(focusedItem!.getAttribute('aria-posinset')).toBe('1');
            });
        });

        it('should focus first founded item after search', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: undefined,
                selectionMode: 'single',
            });

            fireEvent.click(dom.input);

            const dialog = await screen.findByRole('dialog');

            fireEvent.change(dom.input, { target: { value: 'A' } });

            await PickerInputTestObject.waitForOptionsToBeReady();

            await waitFor(() => {
                const focusedItem = dialog.querySelector('.uui-focus');
                expect(focusedItem?.getAttribute('aria-posinset')).toBe('1');
            });
        });

        it('should select focused item by enter', async () => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                value: undefined,
                selectionMode: 'single',
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            fireEvent.keyDown(dom.input, { key: 'Enter', code: 'Enter', charCode: 13 });
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenCalledWith(2);
            });
        });

        it('should remove last item from selection by backspace in case of searchPosition="input"', async () => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                value: [2, 3, 4],
                selectionMode: 'multi',
                searchPosition: 'input',
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            fireEvent.keyDown(dom.input, { key: 'Backspace', code: 'Backspace', charCode: 8 });

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenCalledWith([2, 3]);
            });

            fireEvent.keyDown(dom.input, { key: 'Backspace', code: 'Backspace', charCode: 8 });
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenCalledWith([2]);
            });
        });

        it('should not remove disabled item from selection by backspace if in case of searchPosition="input"', async () => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                value: [2, 3, 4],
                selectionMode: 'multi',
                searchPosition: 'input',
                getRowOptions: () => ({ checkbox: { isVisible: true, isDisabled: true } }),
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.waitForOptionsToBeReady();

            fireEvent.keyDown(dom.input, { key: 'Backspace', code: 'Backspace', charCode: 8 });

            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenCalledTimes(0);
            });

            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.target)).toEqual([
                    'A1',
                    'A1+',
                    'A2',
                ]);
            });
        });

        it.each<[undefined | null | []]>([[[]], [undefined], [null]])
        ('should not call onValueChange on edit search with emptyValue = %s; and return emptyValue = %s on check -> uncheck', async (emptyValue) => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                emptyValue: emptyValue,
                value: emptyValue as (undefined | []),
                selectionMode: 'multi',
                searchPosition: 'body',
            });

            fireEvent.click(dom.input);

            const dialog = await screen.findByRole('dialog');
            const bodyInput = await within(dialog).findByPlaceholderText('Search');
            fireEvent.change(bodyInput, { target: { value: 'A' } });

            expect(mocks.onValueChange).toHaveBeenCalledTimes(0);

            // Test value after check -> uncheck
            await PickerInputTestObject.clickOptionCheckbox('A1'); // check
            await PickerInputTestObject.clickOptionCheckbox('A1'); // uncheck

            await waitFor(async () => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith(emptyValue);
            });
        });

        it.each<[undefined | null | []]>([[[]], [undefined], [null]])
        ('should not call onValueChange on edit search if emptyValue = %s does not equal to the initial value', async (emptyValue) => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                emptyValue: emptyValue,
                value: undefined,
                selectionMode: 'multi',
                searchPosition: 'body',
            });

            fireEvent.click(dom.input);

            const dialog = await screen.findByRole('dialog');
            const bodyInput = await within(dialog).findByPlaceholderText('Search');
            fireEvent.change(bodyInput, { target: { value: 'A' } });

            expect(mocks.onValueChange).toHaveBeenCalledTimes(0);
        });

        it('should not call onValueChange on edit search if emptyValue on clear button', async () => {
            const { dom, mocks } = await setupPickerInputForTest<TestItemType, number>({
                emptyValue: [],
                value: undefined,
                selectionMode: 'multi',
                searchPosition: 'body',
            });

            fireEvent.click(dom.input);

            await PickerInputTestObject.clickOptionCheckbox('A1'); // check

            await PickerInputTestObject.clickClearAllOptions();

            await waitFor(async () => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([]);
            });
        });
    });
});
