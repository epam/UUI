import React, { ReactNode } from 'react';
import { ArrayDataSource, AsyncDataSource, CascadeSelection, IDataSource } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, delay, delayAct, act, prettyDOM,
    queryHelpers,
} from '@epam/uui-test-utils';
import { Modals, PickerInputBaseProps } from '@epam/uui-components';
import { Button, DataPickerRow, FlexCell, PickerItem, Text } from '@epam/promo';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { IHasEditMode } from '../../types';

jest.mock('react-popper', () => ({
    ...jest.requireActual('react-popper'),
    Popper: function PopperMock({ children }: any) {
        return children({
            ref: jest.fn,
            update: jest.fn(),
            style: {},
            arrowProps: { ref: jest.fn },
            placement: 'bottom-start',
            isReferenceHidden: false,
        });
    },
}));

type TestItemType = {
    id: number;
    level: string;
    name: string;
};

const languageLevels: TestItemType[] = [
    { id: 2, level: 'A1', name: 'Elementary' },
    { id: 3, level: 'A1+', name: 'Elementary+' },
    { id: 4, level: 'A2', name: 'Pre-Intermediate' },
    { id: 5, level: 'A2+', name: 'Pre-Intermediate+' },
    { id: 6, level: 'B1', name: 'Intermediate' },
    { id: 7, level: 'B1+', name: 'Intermediate+' },
    { id: 8, level: 'B2', name: 'Upper-Intermediate' },
    { id: 9, level: 'B2+', name: 'Upper-Intermediate+' },
    { id: 10, level: 'C1', name: 'Advanced' },
    { id: 11, level: 'C1+', name: 'Advanced+' },
    { id: 12, level: 'C2', name: 'Proficiency' },
];

type TestTreeItem = {
    id: number;
    name: string;
    parentId?: number;
};

const treeLikeData: TestTreeItem[] = [
    { id: 1, name: 'Parent 1' },
    { id: 1.1, parentId: 1, name: 'Child 1.1' },
    { id: 1.2, parentId: 1, name: 'Child 1.2' },
    { id: 1.3, parentId: 1, name: 'Child 1.3' },
    { id: 2, name: 'Parent 2' },
    { id: 2.1, parentId: 2, name: 'Child 2.1' },
    { id: 2.2, parentId: 2, name: 'Child 2.2' },
    { id: 2.3, parentId: 2, name: 'Child 2.3' },
    { id: 3, name: 'Parent 3' },
    { id: 3.1, parentId: 3, name: 'Child 3.1' },
    { id: 3.2, parentId: 3, name: 'Child 3.2' },
    { id: 3.3, parentId: 3, name: 'Child 3.3' },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

const mockDataSourceAsync = new AsyncDataSource({
    api: async () => {
        await delay(100);
        return languageLevels;
    },
});

const mockTreeLikeDataSourceAsync = new AsyncDataSource<TestTreeItem, number, any>({
    api: async () => {
        await delay(100);
        return treeLikeData;
    },
    getParentId: ({ parentId }) => parentId,
});

type PickerInputComponentProps<TItem, TId> = PickerInputBaseProps<TItem, TId> & PickerInputProps;

async function setupPickerInputForTest<TItem = TestItemType, TId = number>(params: Partial<PickerInputComponentProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerInputComponentProps<TItem, TId>>(
        (context): PickerInputComponentProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item) => item.level,
                    value: params.value as TId,
                    selectionMode: 'single',
                }, params) as PickerInputComponentProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item) => item.level,
                value: params.value as number[],
                selectionMode: 'multi',
            }, params) as PickerInputComponentProps<TItem, TId>;
        },
        (props) => (
            <>
                <PickerInput { ...props } />
                <Modals />
            </>
        ),
    );
    const input = screen.queryByRole('textbox');

    return {
        setProps,
        result,
        mocks,
        dom: { input },
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
    
    describe('[selectionMode single]', () => {
        it('should select & clear option', async () => {

        const optionC2 = await screen.findByText('C2');
        expect(optionC2).toBeInTheDocument();

    
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
            });
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select');
            fireEvent.click(dom.input as HTMLElement);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
            const clear = screen.getByRole('button');
            fireEvent.click(clear);
            expect(screen.queryByText('C2')).not.toBeInTheDocument();
        });
           
        it('should render names of items by getName', async () => {
            const { mocks, dom } = await setupPickerInputForTest<TestItemType, number>({
                value: 3,
                selectionMode: 'single',
                getName: ({ name }) => name,
            });

            expect(dom.input?.getAttribute('placeholder')?.trim()).toBeUndefined();
            
            await delayAct(100);
        
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual(languageLevels[1].name);
            
            fireEvent.click(dom.input as Element);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('Proficiency');
            fireEvent.click(optionC2);
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
        });
        
        it('should render entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
            });
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Level');
        });
        
        it('should ignore plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Level');
        });
        
        it.each<[CascadeSelection]>(
            [[false], [true], ['implicit'], ['explicit']],
        )
        ('should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'single',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });
    
            fireEvent.click(dom.input as HTMLElement);
            await delayAct(100);
    
            const [, second] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            fireEvent.click(second);
    
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(2);
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Parent 2');
        });
        
        it('should work with maxItems properly', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 1,
                selectionMode: 'single',
            });
    
            fireEvent.click(dom.input as HTMLElement);
            await delayAct(100);
    
            // Check parent
            const [first] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            fireEvent.click(first);

            fireEvent.click(dom.input as HTMLElement);
            const [, second] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);

            fireEvent.click(second);
    
            const checked = 3;
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(checked);
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('A1+');
        });

        it('should disable clear', async () => {
            const { dom, setProps } = await setupPickerInputForTest({
                value: 2,
                selectionMode: 'single',
                disableClear: false,
            });

            await delayAct(100);

            const target = screen.getByTestId('uui-PickerInput-target');
    
            const [clearButton] = within(target).getAllByRole('button').filter((el) => el.getAttribute('aria-label') === 'Clear');
            
            expect(clearButton).toBeInTheDocument();
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('A1');

            fireEvent.click(clearButton);
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select');
            
            setProps({ disableClear: true, value: 2 });
            
            const [clearButton2] = within(target).queryAllByRole('button').filter((el) => el.getAttribute('aria-label') === 'Clear');
            
            expect(clearButton2).toBeUndefined();
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('A1');
        });
    });

    describe('[selectionMode multi]', () => {
        it('should select & clear several options', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
            });
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select');
            fireEvent.click(dom.input as HTMLElement);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const [cb1, cb2] = await within(screen.getByRole('dialog')).findAllByRole('checkbox');
            fireEvent.click(cb1);
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            fireEvent.click(cb2);
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            expect(cb1).toBeChecked();
            expect(cb2).toBeChecked();
            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryAllByRole('button')).toHaveLength(3); // 2 tags and 1 clear button
            const a1 = screen.getByText('A1');
            const a1Clear = a1.nextElementSibling;
            const a1plus = screen.getByText('A1+');
            const a1plusClear = a1plus.nextElementSibling;
            fireEvent.click(a1Clear as HTMLElement);
            expect(screen.queryAllByRole('button')).toHaveLength(2); // 1 tag and 1 clear button
            fireEvent.click(a1plusClear as HTMLElement);
            expect(screen.queryAllByRole('button')).toHaveLength(0);
        });
        
        it('should render names of items by getName', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [3, 4],
                selectionMode: 'multi',
                getName: ({ name }) => name,
            });
    
            const selectedItemsNames1 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(selectedItemsNames1).toEqual(['', '']);
    
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select');
       
            await delayAct(100);
    
            const selectedItemsNames2 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(selectedItemsNames2).toEqual(['Elementary+', 'Pre-Intermediate']);
        });
    
        it('should render entity name with \'s\' in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
            });
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Levels');
        });
    
        it('should render plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });
            
            expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Multiple Language Levels');
        });
        
        it('should pick single element with cascadeSelection = false', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: false,
                dataSource: mockTreeLikeDataSourceAsync,
            });
    
            fireEvent.click(dom.input as HTMLElement);
            await delayAct(100);
    
            const [, second] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            const checkbox = await within(second).findByRole('checkbox');
            fireEvent.click(checkbox);
    
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            const selectedItemsNames1 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(checkbox).toBeChecked();
            expect(selectedItemsNames1).toEqual(['Parent 2']);
        });
        
        it.each<[CascadeSelection]>(
            [[true], ['explicit']],
        )
        ('should pick multiple elements with cascadeSelection = %s', async (cascadeSelection) => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });
    
            fireEvent.click(dom.input as HTMLElement);
            await delayAct(100);
    
            // Check parent
            const [, second] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            const checkbox = await within(second).findByRole('checkbox');
            fireEvent.click(checkbox);
            
            // Unfold parent
            const foldButton = await within(second).findByTestId(/uui-DataTableRowAddons-folding-arrow/);
            fireEvent.click(foldButton);
    
            // Test if checkboxes are checked/unchecked
            const checked = [2, 2.1, 2.2, 2.3];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(checked);
            const selectedItemsNames1 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(checkbox).toBeChecked();
            expect(selectedItemsNames1).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            
            const rows = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            
            const requiredCheckboxes = [];
            const restOfCheckboxes = [];
            for (const row of rows) {
                if (!checked.some((id) => `uui-PickerInput-item-${id}` === row.getAttribute('data-testid')?.trim())) {
                    restOfCheckboxes.push(await within(row).findByRole('checkbox'));
                } else {
                    requiredCheckboxes.push(await within(row).findByRole('checkbox'));
                }
            }
            requiredCheckboxes.forEach((cb) => expect(cb).toBeChecked());
            restOfCheckboxes.forEach((cb) => expect(cb).not.toBeChecked());
    
            // Check child
            const child = within(screen.getByRole('dialog')).queryByTestId(/uui-PickerInput-item-2.2/);
            
            const childCheckbox = await within(child as HTMLElement).findByRole('checkbox');
            fireEvent.click(childCheckbox);
           
            // Test if checkboxes are checked/unchecked
            const newChecked = [2.1, 2.3];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(newChecked);
            const selectedItemsNames3 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(childCheckbox).not.toBeChecked();
            expect(selectedItemsNames3).toEqual(['Child 2.1', 'Child 2.3']);
            
            const rows2 = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
        
            const requiredCheckboxes2 = [];
            const restOfCheckboxes2 = [];
            for (const row of rows2) {
                if (!newChecked.some((id) => `uui-PickerInput-item-${id}` === row.getAttribute('data-testid')?.trim())) {
                    restOfCheckboxes2.push(await within(row).findByRole('checkbox'));
                } else {
                    requiredCheckboxes2.push(await within(row).findByRole('checkbox'));
                }
            }
            requiredCheckboxes2.forEach((cb) => expect(cb).toBeChecked());
            restOfCheckboxes2.forEach((cb) => expect(cb).not.toBeChecked());
        });
    
        it('should pick single element with cascadeSelection = implicit', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: 'implicit',
                dataSource: mockTreeLikeDataSourceAsync,
            });
    
            fireEvent.click(dom.input as HTMLElement);
    
            await delayAct(100);
            
            // Check parent
            const [, second] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            const checkbox = await within(second).findByRole('checkbox');
            fireEvent.click(checkbox);
    
            // Unfold parent
            const foldButton = await within(second).findByTestId(/uui-DataTableRowAddons-folding-arrow/);
            fireEvent.click(foldButton);
    
            const checked = [2, 2.1, 2.2, 2.3];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            const selectedItemsNames1 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(checkbox).toBeChecked();
            expect(selectedItemsNames1).toEqual(['Parent 2']);
            
            const rows = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
        
            // Test if checkboxes are checked/unchecked
            const requiredCheckboxes = [];
            const restOfCheckboxes = [];
            for (const row of rows) {
                if (!checked.some((id) => `uui-PickerInput-item-${id}` === row.getAttribute('data-testid')?.trim())) {
                    restOfCheckboxes.push(await within(row).findByRole('checkbox'));
                } else {
                    requiredCheckboxes.push(await within(row).findByRole('checkbox'));
                }
            }
            requiredCheckboxes.forEach((cb) => expect(cb).toBeChecked());
            restOfCheckboxes.forEach((cb) => expect(cb).not.toBeChecked());
            
            // Check child
            const child = within(screen.getByRole('dialog')).queryByTestId(/uui-PickerInput-item-2.2/);
            
            const childCheckbox = await within(child as HTMLElement).findByRole('checkbox');
            fireEvent.click(childCheckbox);
           
            // Test if checkboxes are checked/unchecked
            const newChecked = [2.1, 2.3];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(newChecked);
            const selectedItemsNames3 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(childCheckbox).not.toBeChecked();
            expect(selectedItemsNames3).toEqual(['Child 2.1', 'Child 2.3']);
            
            const rows2 = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
        
            const requiredCheckboxes2 = [];
            const restOfCheckboxes2 = [];
            for (const row of rows2) {
                if (!newChecked.some((id) => `uui-PickerInput-item-${id}` === row.getAttribute('data-testid')?.trim())) {
                    restOfCheckboxes2.push(await within(row).findByRole('checkbox'));
                } else {
                    requiredCheckboxes2.push(await within(row).findByRole('checkbox'));
                }
            }
            requiredCheckboxes2.forEach((cb) => expect(cb).toBeChecked());
            restOfCheckboxes2.forEach((cb) => expect(cb).not.toBeChecked());
        });

        it('should wrap up if number of elements is greater than maxItems', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 3,
                entityPluralName: 'languages',
                selectionMode: 'multi',
            });
    
            fireEvent.click(dom.input as HTMLElement);
            await delayAct(100);
    
            // Check parent
            const [first, second, third, forth] = within(screen.getByRole('dialog')).queryAllByTestId(/uui-PickerInput-item/);
            fireEvent.click(first);
            fireEvent.click(second);
    
            const checked = [2, 3];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(checked);
            const selectedItemsNames = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(selectedItemsNames).toEqual(['A1', 'A1+']);
            
            fireEvent.click(third);
            fireEvent.click(forth);
            const newChecked = [2, 3, 4, 5];
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(newChecked);
            const selectedItemsNames2 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());
            
            expect(selectedItemsNames2).toEqual(['4 languages selected']);
        });
        
        it('should disable clear', async () => {
            const { setProps } = await setupPickerInputForTest({
                value: [2, 3],
                selectionMode: 'multi',
                disableClear: false,
            });

            await delayAct(100);

            const target = screen.getByTestId('uui-PickerInput-target');
    
            const [clearButton] = within(target).getAllByRole('button').filter((el) => el.getAttribute('aria-label') === 'Clear');
            
            expect(clearButton).toBeInTheDocument();
            
            const selectedItemsNames = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());

            expect(selectedItemsNames).toEqual(['A1', 'A1+']);

            fireEvent.click(clearButton);
            
            const selectedItemsNames2 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());

            expect(selectedItemsNames2).toEqual([]);
            
            setProps({ disableClear: true, value: [2, 3] });
            
            const [clearButton2] = within(target).queryAllByRole('button').filter((el) => el.getAttribute('aria-label') === 'Clear');
            
            expect(clearButton2).toBeUndefined();
            const selectedItemsNames3 = screen.queryAllByTestId(/uui-PickerToggler-item/)
                .map((button) => button.textContent?.trim());

            expect(selectedItemsNames3).toEqual(['A1', 'A1+']);
        });
    });
    
    it('should disable input', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            isDisabled: true,
        });
        
        expect(dom.input?.hasAttribute('disabled')).toBeTruthy();
        expect(dom.input?.getAttribute('aria-disabled')?.trim()).toEqual('true');

        fireEvent.click(dom.input as Element);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should make an input readonly', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            isReadonly: true,
        });
        
        expect(dom.input?.hasAttribute('readonly')).toBeTruthy();
        expect(dom.input?.getAttribute('aria-readonly')?.trim()).toEqual('true');

        fireEvent.click(dom.input as Element);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it.each<[IHasEditMode['mode'] | undefined]>(
        [[undefined], ['form'], ['cell'], ['inline']],
    )('should apply mode = %s to a toggler', async (mode) => {
        await setupPickerInputForTest({
            value: undefined,
            mode,
        });
        
        const target = screen.queryByTestId(/uui-PickerInput-target/);
        
        expect(target?.getAttribute('class')?.trim().includes(`mode-${mode ?? 'form'}`)).toBeTruthy();
    });
    
    it('should render icon', async () => {
        await setupPickerInputForTest({
            value: undefined,
            icon: () => <div data-testid = "icon" />,
        });
        
        const target = screen.queryByTestId(/uui-PickerInput-target/);
        const icon = within(target as HTMLElement).queryByTestId(/uui-PickerToggler-iconContainer/);
        expect(icon).toBeDefined();
    });
    
    it.each<['left' | undefined]>(
        [[undefined], ['left']],
    )('should render icon to the left', async (iconPosition) => {
        await setupPickerInputForTest({
            value: undefined,
            icon: () => <div />,
            iconPosition,
        });
        
        const target = screen.queryByTestId(/uui-PickerInput-target/);
        const icon = within(target as HTMLElement).queryByTestId(/uui-PickerToggler-iconContainer/);
        expect(icon).toBeDefined();
        
        const elements = within(target as HTMLElement).queryAllByTestId(/uui-PickerToggler-/);
        expect(elements.length).toBe(3);
        expect(elements[1]).toEqual(icon);
        
        expect(elements[2]).toEqual(within(target as HTMLElement).queryByTestId(/uui-PickerToggler-input/));
    });
    
    it('should render icon to the right', async () => {
        await setupPickerInputForTest({
            value: undefined,
            icon: () => <div />,
            iconPosition: 'right',
        });
        
        const target = screen.queryByTestId(/uui-PickerInput-target/);
        const icon = within(target as HTMLElement).queryByTestId(/uui-PickerToggler-iconContainer/);
        expect(icon).toBeDefined();
        
        const elements = within(target as HTMLElement).queryAllByTestId(/uui-PickerToggler-/);
        expect(elements.length).toBe(3);
        expect(elements[1]).toEqual(within(target as HTMLElement).queryByTestId(/uui-PickerToggler-input/));
        expect(elements[2]).toEqual(icon);
    });

    it('should pass onClick to the icon', async () => {
        const onIconClick = jest.fn();
        await setupPickerInputForTest({
            value: undefined,
            onIconClick,
            icon: () => <div />,
        });
        
        const target = screen.queryByTestId(/uui-PickerInput-target/);
        const icon = within(target as HTMLElement).queryByTestId(/uui-PickerToggler-iconContainer/);
        expect(icon).toBeDefined();

        fireEvent.click(icon as HTMLElement);
        expect(onIconClick).toBeCalledTimes(1);
    });
    
    it('should open dialog only when minCharsToSearch is reached', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            minCharsToSearch: 1,
        });

        fireEvent.click(dom.input as Element);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        
        act(() => {
            jest.useFakeTimers();
        });

        fireEvent.change(dom.input as Element, { target: { value: 'A' } });

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        act(() =>{
            jest.useRealTimers();
        });
    });
    
    it('should use modal edit mode', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            editMode: 'modal',
        });

        fireEvent.click(dom.input as HTMLElement);
         
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('modal')).toBeInTheDocument();

        await delayAct(100);

        const rows = within(screen.getByRole('modal')).queryAllByTestId(/uui-PickerInput-item/);
        const names = rows.map((row) => row.textContent);
        expect(names).toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);
    });

    it('should mark input as invalid', async () => {
        const { setProps } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
        });

        const target = screen.queryByTestId(/uui-PickerInput-target/);
        expect(target?.getAttribute('class')?.trim().includes('uui-invalid')).toBeFalsy();

        setProps({ isInvalid: true });

        const target1 = screen.queryByTestId(/uui-PickerInput-target/);
        expect(target1?.getAttribute('class')?.trim().includes('uui-invalid')).toBeTruthy();
    });
    
    it('should support single line', async () => {
        const { setProps } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            isSingleLine: false,
        });

        const togglerBody = screen.queryByTestId(/uui-PickerToggler-body/);
        expect(togglerBody).toHaveClass('multiline');

        setProps({ isSingleLine: true });

        const togglerBody1 = screen.queryByTestId(/uui-PickerToggler-body/);
        expect(togglerBody1).not.toHaveClass('multiline');
    });

    it('should provide custom placeholder', async () => {
        const customPlaceholder = 'Custom placeholder';
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            placeholder: customPlaceholder,
        });

        expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual(customPlaceholder);
    });
    
    it('should define minBodyWidth', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            minBodyWidth: 300,
        });

        fireEvent.click(dom.input as Element);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        
        const dialogBody = dialog.firstElementChild;
        expect(dialogBody).toHaveStyle('width: 300px');
    });
    
    it('should define dropdownHeight', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            dropdownHeight: 100,
        });

        fireEvent.click(dom.input as Element);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        
        const dialogBody = dialog.firstElementChild?.firstElementChild;
        expect(dialogBody).toHaveStyle('max-height: 100px');
    });

    it('should render custom toggler', async () => {
        const { mocks } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            renderToggler: (props) => (
                <Button
                    rawProps={ props.rawProps }
                    size="36"
                    onClick={ props.onClick }
                    ref={ props.ref }
                    iconPosition="left"
                    mode="ghost"
                    caption={ props.selection?.map((s) => s.value?.name).join(', ') }
                />
            ),
        });

        const target = screen.getByTestId('uui-PickerInput-target');
        expect(target).toBeInTheDocument();
        expect(target.getAttribute('type')).toBe('button');
        
        fireEvent.click(target);
        
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await delayAct(100);

        const [cb1, cb2] = await within(screen.getByRole('dialog')).findAllByRole('checkbox');
        fireEvent.click(cb1);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
        fireEvent.click(cb2);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
        expect(cb1).toBeChecked();
        expect(cb2).toBeChecked();
        expect(target.textContent).toBe('Elementary, Elementary+');
    });
    
    it('should render search in input', async () => {
        await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'input',
        });

        const togglerBody = screen.getByTestId('uui-PickerToggler-body');
        expect(togglerBody).toBeInTheDocument();
        const input = within(togglerBody).getByTestId('uui-PickerToggler-input');
        expect(input).toBeInTheDocument();
        
        fireEvent.click(input);
        
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render search in body', async () => {
        await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'body',
        });

        const togglerBody = screen.getByTestId('uui-PickerToggler-body');
        expect(togglerBody).toBeInTheDocument();
        const togglerInput = within(togglerBody).getByTestId('uui-PickerToggler-input');
        expect(togglerInput.hasAttribute('readonly')).toBeTruthy();
        
        fireEvent.click(togglerBody);

        const dialog = screen.getByRole('dialog');
        const bodyInput = within(dialog).getByPlaceholderText('Search');
        expect(bodyInput).toBeInTheDocument();
        expect(bodyInput.hasAttribute('readonly')).toBeFalsy();
    });
    
    it('should not render search in none mode', async () => {
        await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'none',
        });

        const togglerBody = screen.getByTestId('uui-PickerToggler-body');
        expect(togglerBody).toBeInTheDocument();
        const togglerInput = within(togglerBody).getByTestId('uui-PickerToggler-input');
        expect(togglerInput.hasAttribute('readonly')).toBeTruthy();
        
        fireEvent.click(togglerBody);

        const dialog = screen.getByRole('dialog');
        expect(within(dialog).queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('should render custom not found', async () => {
        const mockEmptyDS = new ArrayDataSource<TestItemType, number, any>({
            items: [],
            getId: ({ id }) => id,
        });

        const customText = 'Custom Text or Component';

        const { dom } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            dataSource: mockEmptyDS as IDataSource<TestItemType, number, any>,
            renderNotFound: () => (
                <FlexCell grow={ 1 } textAlign="center" rawProps={ { 'data-testid': 'custom-not-found' } }>
                    <Text>{customText}</Text>
                </FlexCell>
            ),
        });

        fireEvent.click(dom.input as Element);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        
        const notFound = within(dialog).getByTestId('custom-not-found');
        expect(notFound).toBeInTheDocument();

        const text = notFound.textContent;
        expect(text).toBe(customText);
    });

    it('should render custom row', async () => {
        const { dom } = await setupPickerInputForTest<TestItemType, number>({
            value: undefined,
            selectionMode: 'multi',
            renderRow: (props) => (
                <DataPickerRow
                    { ...props }
                    rawProps={ { ...props.rawProps, 'data-testid': `custom-row-${props.rowKey}` } }
                    key={ props.rowKey }
                    alignActions="center"
                    renderItem={ (item, rowProps) => <PickerItem { ...rowProps } title={ item.name } /> }
                />
            ),
        });

        fireEvent.click(dom.input as Element);

        await delayAct(100);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        
        const rows = within(dialog).getAllByTestId(/custom-row/);
        expect(rows.length).toBe(languageLevels.length);
        rows.forEach((row) => {
            expect(row).toBeInTheDocument();
        });
    });
});
