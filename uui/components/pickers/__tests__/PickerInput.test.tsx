import React, { ReactNode } from 'react';
import { ArrayDataSource, CascadeSelection } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, waitFor, userEvent, PickerInputTestObject, act,
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
                            return;
                        }
                        context.current?.setProperty('value', newValue);
                    }),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    value: params.value as TId,
                    selectionMode: 'single',
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

describe('PickerInput', () => {
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
                renderFooter={ (props) => <div>{props as unknown as ReactNode}</div> }
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
            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            PickerInputTestObject.removeSelectedTagByText(dom.input, 'A1+');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1']);
            });
            
            PickerInputTestObject.removeSelectedTagByText(dom.input, 'A1');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual([]);
            });
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
            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            PickerInputTestObject.removeSelectedTagByText(dom.input, 'A1+');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1']);
            });
            PickerInputTestObject.removeSelectedTagByText(dom.input, 'A1');
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual([]);
            });
        });

        it('should render names of items by getName', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [3, 4],
                selectionMode: 'multi',
                getName: ({ name }) => name,
            });
            expect(PickerInputTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
            await waitFor(() => expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['Elementary+', 'Pre-Intermediate']));
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
            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);
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

            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
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

            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);

            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerInputTestObject.clickOptionCheckbox('Child 2.2');
            await waitFor(() => {
                // Test if checkboxes are checked/unchecked
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
            });
            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['Child 2.1', 'Child 2.3']);
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
            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            await PickerInputTestObject.clickOptionByText('A2');
            await PickerInputTestObject.clickOptionByText('A2+');
          
            await waitFor(() => {
                expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3, 4, 5]);
            });

            expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+', '+ 2']);
        });

        it('should disable clear', async () => {
            const { setProps, dom, result } = await setupPickerInputForTest({
                value: [2, 3],
                selectionMode: 'multi',
                disableClear: false,
            });
            await waitFor(() => expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']));
            PickerInputTestObject.clearInput(result.container);
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual([]);
            });

            setProps({ disableClear: true, value: [2, 3] });
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);
            });
            expect(PickerInputTestObject.hasClearInputButton(result.container)).toBeFalsy();
        });

        it('should select all', async () => {
            const { dom } = await setupPickerInputForTest({
                value: [],
                selectionMode: 'multi',
                maxItems: 100,
            });

            fireEvent.click(dom.input);
            await waitFor(async () => {
                expect(await PickerInputTestObject.hasOptions()).toBeTruthy();
            });

            await PickerInputTestObject.clickSelectAllOptions();
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);
            });

            await PickerInputTestObject.clickClearAllOptions();
            await waitFor(() => {
                expect(PickerInputTestObject.getSelectedTagsText(dom.input)).toEqual([]);
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

        it('should clear search on show only selected toggle', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [4, 2, 6, 8],
                selectionMode: 'multi',
                searchPosition: 'body',
            });

            fireEvent.click(dom.target);

            const dialog = await PickerInputTestObject.findDialog();
            expect(dialog).toBeInTheDocument();

            await PickerInputTestObject.waitForOptionsToBeReady();

            const searchInput = within(dialog).queryByRole('searchbox') as HTMLInputElement;
            fireEvent.change(searchInput, { target: { value: 'search' } });

            await PickerInputTestObject.clickShowOnlySelected();

            await waitFor(() => expect(searchInput.value).toEqual(''));
            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual([]);
        });

        it('should turn off show only selected mode on search change', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [4, 2, 6, 8],
                selectionMode: 'multi',
                searchPosition: 'body',
            });

            fireEvent.click(dom.target);

            const dialog = screen.queryByRole('dialog');
            expect(dialog).toBeInTheDocument();
            await PickerInputTestObject.waitForOptionsToBeReady();

            await PickerInputTestObject.clickShowOnlySelected();

            expect(await PickerInputTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
            expect(await PickerInputTestObject.findUncheckedOptions()).toEqual([]);

            const searchInput = within(dialog!).getByRole('searchbox') as HTMLInputElement;
            fireEvent.change(searchInput, { target: { value: 'search' } });

            const showOnlySelectedSwitch = within(dialog!).queryByRole('switch', { name: 'Show only selected' }) as HTMLInputElement;

            await waitFor(() => expect(showOnlySelectedSwitch.checked).toEqual(false));
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
                    caption={ props.selection?.displayedRows.map((s) => s.value?.name).join(', ') }
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
        let btn;
        function addFocusableElementBefore() {
            const btnEl = document.createElement('button');
            document.body.prepend(btnEl);
            return btnEl;
        }

        beforeAll(() => {
            btn = addFocusableElementBefore();
        });

        const testInputFocus = async (selectionMode, searchPosition?) => {
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

        it.each<[undefined | null | []]>([[[]]])
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
    });
});
