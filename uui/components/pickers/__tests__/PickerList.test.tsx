import React, { ReactNode } from 'react';
import {
    setupComponentForTest, fireEvent, PickerListTestObject, screen,
} from '@epam/uui-test-utils';
import { Modals } from '@epam/uui-components';
import { PickerList, PickerListProps } from '../PickerList';
import { TestItemType, mockDataSource, mockDataSourceAsync } from './mocks';

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
            cascadeSelection: true,
            disallowClickOutside: true,
            maxDefaultItems: 20,
            maxTotalItems: 40,
            defaultIds: [2, 3],
        });
        await PickerListTestObject.waitForOptionsToBeReady();

        expect(result.baseElement).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { result } = await setupPickerListForTest({
            value: undefined,
            selectionMode: 'single',
            dataSource: mockDataSourceAsync,
            getName: ({ name }) => name,
        });

        await PickerListTestObject.waitForOptionsToBeReady();
        
        const toggler = PickerListTestObject.getPickerToggler();  
        fireEvent.click(toggler);

        await PickerListTestObject.waitForOptionsToBeReady('modal');

        expect(result.baseElement).toMatchSnapshot();
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
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(5);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            const toggler = PickerListTestObject.getPickerToggler();  
            fireEvent.click(toggler);
    
            await PickerListTestObject.waitForOptionsToBeReady('modal');
            
            const selectedOption = await PickerListTestObject.findSelectedOption({ editMode: 'modal' });
            expect(selectedOption).toBe('A2+');
        });
    });   
    //     it('[valueType entity] should select & clear option', async () => {
    //         const { dom, mocks } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'single',
    //             valueType: 'entity',
    //         });
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         fireEvent.click(dom.input);
    //         expect(screen.getByRole('dialog')).toBeInTheDocument();
    //         const optionC2 = await screen.findByText('C2');
    //         fireEvent.click(optionC2);
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 12, level: 'C2', name: 'Proficiency' });
    //         fireEvent.click(window.document.body);
    //         expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //         expect(screen.getByPlaceholderText('C2')).toBeInTheDocument();
    //         const clear = screen.getByRole('button');
    //         fireEvent.click(clear);
    //         expect(screen.queryByText('C2')).not.toBeInTheDocument();
    //     });

    //     it('should render names of items by getName', async () => {
    //         const { mocks, dom } = await setupPickerListForTest<TestItemType, number>({
    //             value: 3,
    //             selectionMode: 'single',
    //             getName: ({ name }) => name,
    //         });

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toBeUndefined();
    //         await waitFor(async () => expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Elementary+'));

    //         fireEvent.click(dom.input);
    //         expect(screen.getByRole('dialog')).toBeInTheDocument();
    //         const optionC2 = await screen.findByText('Proficiency');
    //         fireEvent.click(optionC2);
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
    //     });

    //     it('should render entity name in placeholder', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'single',
    //             entityName: 'Language Level',
    //         });

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
    //     });

    //     it('should ignore plural entity name in placeholder', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'single',
    //             entityName: 'Language Level',
    //             entityPluralName: 'Multiple Language Levels',
    //         });

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
    //     });

    //     it.each<[CascadeSelection]>(
    //         [[false], [true], ['implicit'], ['explicit']],
    //     )
    //     ('should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             getName: ({ name }) => name,
    //             selectionMode: 'single',
    //             cascadeSelection,
    //             dataSource: mockTreeLikeDataSourceAsync,
    //         });
    //         fireEvent.click(dom.input);
 
    //         await PickerListTestObject.waitForOptionsToBeReady();

    //         // Check parent
    //         await PickerListTestObject.clickOptionByText('Parent 2');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith(2);
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Parent 2');
    //     });

    //     it('should work with maxItems properly', async () => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             maxItems: 1,
    //             selectionMode: 'single',
    //         });

    //         fireEvent.click(dom.input);

    //         await PickerListTestObject.waitForOptionsToBeReady();

    //         // Check parent
    //         await PickerListTestObject.clickOptionByText('A1');
    //         fireEvent.click(dom.input);
    //         await PickerListTestObject.clickOptionByText('A1+');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith(3);
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('A1+');
    //     });

    //     it('should disable clear', async () => {
    //         const { dom, setProps } = await setupPickerListForTest({
    //             value: 2,
    //             selectionMode: 'single',
    //             disableClear: false,
    //         });

    //         await waitFor(() => expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('A1'));

    //         const clearButton = within(dom.container).getByRole('button', { name: 'Clear' });
    //         expect(clearButton).toBeInTheDocument();
    //         fireEvent.click(clearButton);
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         setProps({ disableClear: true, value: 2 });
    //         expect(within(dom.container).queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('A1');
    //     });

    //     it('should clear selected item', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'single',
    //             maxItems: 100,
    //         });
    //         fireEvent.click(dom.input);

    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();

    //         const clearButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
    //         expect(clearButton).toBeInTheDocument();
    //         expect(clearButton).toHaveAttribute('aria-disabled', 'true');

    //         await PickerListTestObject.clickOptionByText('A1');
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('A1');

    //         fireEvent.click(dom.input);

    //         const clearButton2 = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
    //         expect(clearButton2).toHaveAttribute('aria-disabled', 'false');

    //         fireEvent.click(clearButton2);

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         const clearButton3 = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
    //         expect(clearButton3).toHaveAttribute('aria-disabled', 'true');
    //     });
    // });

    // describe('[selectionMode multi]', () => {
    //     it('[valueType id] should select & clear several options', async () => {
    //         const { dom, mocks } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'multi',
    //         });
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         fireEvent.click(dom.input);
    //         expect(screen.getByRole('dialog')).toBeInTheDocument();

    //         await PickerListTestObject.clickOptionCheckbox('A1');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);

    //         await PickerListTestObject.clickOptionCheckbox('A1+');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

    //         fireEvent.click(window.document.body);
    //         expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

    //         PickerListTestObject.removeSelectedTagByText(dom.input, 'A1+');
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1']);

    //         PickerListTestObject.removeSelectedTagByText(dom.input, 'A1');
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual([]);
    //     });

    //     it('[valueType entity] should select & clear several options', async () => {
    //         const { dom, mocks } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'multi',
    //             valueType: 'entity',
    //         });
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         fireEvent.click(dom.input);
    //         expect(screen.getByRole('dialog')).toBeInTheDocument();

    //         await PickerListTestObject.clickOptionCheckbox('A1');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([{ id: 2, level: 'A1', name: 'Elementary' }]);

    //         await PickerListTestObject.clickOptionCheckbox('A1+');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([
    //             { id: 2, level: 'A1', name: 'Elementary' },
    //             { id: 3, level: 'A1+', name: 'Elementary+' },
    //         ]);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

    //         fireEvent.click(window.document.body);
    //         expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

    //         PickerListTestObject.removeSelectedTagByText(dom.input, 'A1+');
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1']);

    //         PickerListTestObject.removeSelectedTagByText(dom.input, 'A1');
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual([]);
    //     });
    //     it('should render names of items by getName', async () => {
    //         const { dom } = await setupPickerListForTest<TestItemType, number>({
    //             value: [3, 4],
    //             selectionMode: 'multi',
    //             getName: ({ name }) => name,
    //         });
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['', '']);
    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select');
    //         await waitFor(() => expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Elementary+', 'Pre-Intermediate']));
    //     });

    //     it('should render entity name with \'s\' in placeholder', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'multi',
    //             entityName: 'Language Level',
    //         });

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select Language Levels');
    //     });

    //     it('should render plural entity name in placeholder', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: undefined,
    //             selectionMode: 'multi',
    //             entityName: 'Language Level',
    //             entityPluralName: 'Multiple Language Levels',
    //         });

    //         expect(PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Please select Multiple Language Levels');
    //     });

    //     it('should pick single element with cascadeSelection = false', async () => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             getName: ({ name }) => name,
    //             selectionMode: 'multi',
    //             cascadeSelection: false,
    //             dataSource: mockTreeLikeDataSourceAsync,
    //         });
    //         fireEvent.click(dom.input);
    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();
    //         await PickerListTestObject.clickOptionCheckbox('Parent 2');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);

    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['Parent 2']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);
    //     });

    //     it.each<[CascadeSelection]>(
    //         [[true], ['explicit']],
    //     )
    //     ('should pick multiple elements with cascadeSelection = %s', async (cascadeSelection) => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             getName: ({ name }) => name,
    //             selectionMode: 'multi',
    //             cascadeSelection,
    //             dataSource: mockTreeLikeDataSourceAsync,
    //         });

    //         fireEvent.click(dom.input);
    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();
    //         // Check parent
    //         await PickerListTestObject.clickOptionCheckbox('Parent 2');
    //         // Unfold parent
    //         await PickerListTestObject.clickOptionUnfold('Parent 2');
    //         // Test if checkboxes are checked/unchecked
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 2.1, 2.2, 2.3]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

    //         // Check child
    //         await PickerListTestObject.clickOptionCheckbox('Child 2.2');
    //         // Test if checkboxes are checked/unchecked
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Child 2.1', 'Child 2.3']);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
    //     });

    //     it('should pick single element with cascadeSelection = implicit', async () => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             getName: ({ name }) => name,
    //             selectionMode: 'multi',
    //             cascadeSelection: 'implicit',
    //             dataSource: mockTreeLikeDataSourceAsync,
    //         });

    //         fireEvent.click(dom.input);
    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();

    //         // Check parent
    //         await PickerListTestObject.clickOptionCheckbox('Parent 2');
    //         // Unfold parent
    //         await PickerListTestObject.clickOptionUnfold('Parent 2');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

    //         // Check child
    //         await PickerListTestObject.clickOptionCheckbox('Child 2.2');
    //         // Test if checkboxes are checked/unchecked
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['Child 2.1', 'Child 2.3']);
    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
    //     });

    //     it('should wrap up if number of elements is greater than maxItems', async () => {
    //         const { mocks, dom } = await setupPickerListForTest({
    //             value: undefined,
    //             maxItems: 3,
    //             entityPluralName: 'languages',
    //             selectionMode: 'multi',
    //         });

    //         fireEvent.click(dom.input);
    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();

    //         // Check parent
    //         await PickerListTestObject.clickOptionByText('A1');
    //         await PickerListTestObject.clickOptionByText('A1+');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

    //         await PickerListTestObject.clickOptionByText('A2');
    //         await PickerListTestObject.clickOptionByText('A2+');
    //         expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3, 4, 5]);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['4 languages selected']);
    //     });

    //     it('should disable clear', async () => {
    //         const { setProps, dom, result } = await setupPickerListForTest({
    //             value: [2, 3],
    //             selectionMode: 'multi',
    //             disableClear: false,
    //         });
    //         await waitFor(() => expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']));
    //         PickerListTestObject.clearInput(result.container);
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual([]);

    //         setProps({ disableClear: true, value: [2, 3] });
    //         expect(PickerListTestObject.hasClearInputButton(result.container)).toBeFalsy();
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);
    //     });

    //     it('should select all', async () => {
    //         const { dom } = await setupPickerListForTest({
    //             value: [],
    //             selectionMode: 'multi',
    //             maxItems: 100,
    //         });

    //         fireEvent.click(dom.input);
    //         expect(await PickerListTestObject.hasOptions()).toBeTruthy();

    //         await PickerListTestObject.clickSelectAllOptions();
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);

    //         await PickerListTestObject.clickClearAllOptions();
    //         expect(PickerListTestObject.getSelectedTagsText(dom.input)).toEqual([]);
    //     });
 
    //     it('should show only selected', async () => {
    //         const { dom } = await setupPickerListForTest<TestItemType, number>({
    //             value: [4, 2, 6, 8],
    //             selectionMode: 'multi',
    //         });

    //         fireEvent.click(dom.input);

    //         const dialog = await screen.findByRole('dialog');
    //         expect(dialog).toBeInTheDocument();
            
    //         await PickerListTestObject.waitForOptionsToBeReady();

    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A2', 'B1', 'B2']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual(['A1+', 'A2+', 'B1+', 'B2+', 'C1', 'C1+', 'C2']);
            
    //         await PickerListTestObject.clickShowOnlySelected();

    //         expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A2', 'A1', 'B1', 'B2']);
    //         expect(await PickerListTestObject.findUncheckedOptions()).toEqual([]);
    //     });
    // });

    // it('should disable input', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'single',
    //         isDisabled: true,
    //     });

    //     expect(dom.input.hasAttribute('disabled')).toBeTruthy();
    //     expect(dom.input.getAttribute('aria-disabled')?.trim()).toEqual('true');

    //     fireEvent.click(dom.input);
    //     expect(screen.queryByRole('dialog')).toBeNull();
    // });

    // it('should make an input readonly', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'single',
    //         isReadonly: true,
    //     });

    //     expect(dom.input.hasAttribute('readonly')).toBeTruthy();
    //     expect(dom.input.getAttribute('aria-readonly')?.trim()).toEqual('true');

    //     fireEvent.click(dom.input);
    //     expect(screen.queryByRole('dialog')).toBeNull();
    // });

    // it.each<[IHasEditMode['mode'] | undefined]>(
    //     [[undefined], ['form'], ['cell'], ['inline']],
    // )('should render with mode = %s', async (mode) => {
    //     const props: PickerListComponentProps<TestItemType, number> = {
    //         value: [],
    //         onValueChange: () => {},
    //         valueType: 'id',
    //         dataSource: mockDataSourceAsync,
    //         disableClear: false,
    //         searchPosition: 'input',
    //         getName: (item: TestItemType) => item.level,
    //         selectionMode: 'multi',
    //         mode,
    //     };
    //     expect(await renderSnapshotWithContextAsync(<PickerList { ...props } />)).toMatchSnapshot();
    // });

    // it.each<['left' | 'right' | undefined]>(
    //     [[undefined], ['left'], ['right']],
    // )('should render icon at specific position', async (iconPosition) => {
    //     const props: PickerListComponentProps<TestItemType, number> = {
    //         value: [],
    //         onValueChange: () => {},
    //         valueType: 'id',
    //         dataSource: mockDataSourceAsync,
    //         disableClear: false,
    //         searchPosition: 'input',
    //         getName: (item: TestItemType) => item.level,
    //         selectionMode: 'multi',
    //         icon: () => <div data-testid = "test-icon" />,
    //         iconPosition,
    //     };
    //     expect(await renderSnapshotWithContextAsync(<PickerList { ...props } />)).toMatchSnapshot();
    // });

    // it('should pass onClick to the icon', async () => {
    //     const { mocks } = await setupPickerListForTest({
    //         value: undefined,
    //         onIconClick: jest.fn(),
    //         icon: () => <div data-testid = "test-icon" />,
    //     });

    //     const iconContainer = screen.getByTestId('test-icon').parentElement as Element;
    //     fireEvent.click(iconContainer);
    //     expect(mocks.onIconClick).toBeCalledTimes(1);
    // });

    // it('should open dialog only when minCharsToSearch is reached', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         minCharsToSearch: 1,
    //     });

    //     fireEvent.click(dom.input);

    //     expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //     fireEvent.change(dom.input, { target: { value: 'A' } });
    //     expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // });

    // it('should use modal edit mode', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'single',
    //         editMode: 'modal',
    //     });
    //     fireEvent.click(dom.input);
    //     expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //     expect(
    //         await PickerListTestObject.findOptionsText({ busy: false, editMode: 'modal' }),
    //     ).toEqual(
    //         ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'],
    //     );
    // });

    // it('should render input as invalid', async () => {
    //     const props: PickerListComponentProps<TestItemType, number | undefined> = {
    //         value: undefined,
    //         onValueChange: () => {},
    //         valueType: 'id',
    //         dataSource: mockDataSourceAsync,
    //         disableClear: false,
    //         searchPosition: 'input',
    //         getName: (item: TestItemType) => item.level,
    //         selectionMode: 'single',
    //         isInvalid: true,
    //     };
    //     expect(await renderSnapshotWithContextAsync(<PickerList { ...props } />)).toMatchSnapshot();
    // });

    // it('should support single line', async () => {
    //     const props: PickerListComponentProps<TestItemType, number> = {
    //         value: [],
    //         onValueChange: () => {},
    //         dataSource: mockDataSourceAsync,
    //         disableClear: false,
    //         searchPosition: 'input',
    //         getName: (item: TestItemType) => item.level,
    //         selectionMode: 'multi',
    //         isSingleLine: true,
    //     };
    //     expect(await renderSnapshotWithContextAsync(<PickerList { ...props } />)).toMatchSnapshot();
    // });

    // it('should provide custom placeholder', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         placeholder: 'Custom placeholder',
    //     });
    //     expect(await PickerListTestObject.getPlaceholderText(dom.input)).toEqual('Custom placeholder');
    // });

    // it('should define minBodyWidth', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         minBodyWidth: 300,
    //     });

    //     fireEvent.click(dom.input);

    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();

    //     const dialogBody = dialog.firstElementChild;
    //     expect(dialogBody).toHaveStyle('width: 300px');
    // });

    // it('should define dropdownHeight', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         dropdownHeight: 100,
    //     });

    //     fireEvent.click(dom.input);

    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();

    //     const dialogBody = dialog.firstElementChild?.firstElementChild;
    //     expect(dialogBody).toHaveStyle('max-height: 100px');
    // });

    // it('should render custom toggler', async () => {
    //     const { mocks, dom } = await setupPickerListForTest<TestItemType, number>({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         renderToggler: (props) => (
    //             <Button
    //                 rawProps={ {
    //                     ...props.rawProps,
    //                     'data-testid': 'test-toggler',
    //                 } }
    //                 size="36"
    //                 onClick={ props.onClick }
    //                 ref={ props.ref }
    //                 iconPosition="left"
    //                 mode="ghost"
    //                 caption={ props.selection?.map((s) => s.value?.name).join(', ') }
    //             />
    //         ),
    //     });

    //     expect(dom.target.getAttribute('type')).toBe('button');

    //     fireEvent.click(dom.target);
    //     expect(await PickerListTestObject.hasOptions()).toBeTruthy();

    //     await PickerListTestObject.clickOptionCheckbox('A1');
    //     await PickerListTestObject.clickOptionCheckbox('A1+');
    //     expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);

    //     expect(await PickerListTestObject.findCheckedOptions()).toEqual(['A1', 'A1+']);
    //     expect(screen.getByTestId('test-toggler').textContent?.trim()).toEqual('Elementary, Elementary+');
    // });

    // it('should render search in input', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         searchPosition: 'input',
    //     });
        
    //     expect(dom.input.getAttribute('readonly')).toBe('');
    //     fireEvent.click(dom.input);
    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();
        
    //     const bodyInput = within(dialog).queryByPlaceholderText('Search');
    //     expect(bodyInput).not.toBeInTheDocument();
    // });

    // it('should render search in body', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         searchPosition: 'body',
    //     });

    //     expect(dom.input.hasAttribute('readonly')).toBeTruthy();
    //     fireEvent.click(dom.input);

    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();
    //     const bodyInput = within(dialog).getByPlaceholderText('Search');
    //     expect(bodyInput).toBeInTheDocument();
    //     expect(bodyInput.hasAttribute('readonly')).toBeFalsy();
    // });

    // it('should not render search in none mode', async () => {
    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         searchPosition: 'none',
    //     });

    //     expect(dom.input.hasAttribute('readonly')).toBeTruthy();
    //     fireEvent.click(dom.input);

    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();
    //     expect(within(dialog).queryByPlaceholderText('Search')).not.toBeInTheDocument();
    // });

    // it('should render custom not found', async () => {
    //     const mockEmptyDS = new ArrayDataSource<TestItemType, number, any>({
    //         items: [],
    //         getId: ({ id }) => id,
    //     });

    //     const customText = 'Custom Text or Component';

    //     const { dom } = await setupPickerListForTest({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         dataSource: mockEmptyDS,
    //         renderNotFound: () => (
    //             <FlexCell grow={ 1 } textAlign="center" rawProps={ { 'data-testid': 'test-custom-not-found' } }>
    //                 <Text>{customText}</Text>
    //             </FlexCell>
    //         ),
    //     });

    //     fireEvent.click(dom.input);
    //     const notFound = within(await screen.findByRole('dialog')).getByTestId('test-custom-not-found');
    //     expect(notFound).toHaveTextContent(customText);
    // });

    // it('should render custom row', async () => {
    //     const { dom } = await setupPickerListForTest<TestItemType, number>({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         renderRow: (props) => (
    //             <DataPickerRow
    //                 { ...props }
    //                 key={ props.rowKey }
    //                 alignActions="center"
    //                 renderItem={ (item, rowProps) => <PickerItem { ...rowProps } title={ item.name } /> }
    //             />
    //         ),
    //     });

    //     fireEvent.click(dom.input);
    //     expect(await screen.findByRole('dialog')).toBeInTheDocument();

    //     await PickerListTestObject.waitForOptionsToBeReady();

    //     expect(await PickerListTestObject.findOptionsText({ busy: false })).toEqual([
    //         'Elementary',
    //         'Elementary+',
    //         'Pre-Intermediate',
    //         'Pre-Intermediate+',
    //         'Intermediate',
    //         'Intermediate+',
    //         'Upper-Intermediate',
    //         'Upper-Intermediate+',
    //         'Advanced',
    //         'Advanced+',
    //         'Proficiency',
    //     ]);
    // });
    
    // it('should search items', async () => {
    //     const { dom } = await setupPickerListForTest<TestItemType, number>({
    //         value: undefined,
    //         selectionMode: 'multi',
    //         searchPosition: 'body',
    //         getSearchFields: (item) => [item!.level],
    //     });

    //     expect(dom.input.hasAttribute('readonly')).toBeTruthy();
    //     fireEvent.click(dom.input);

    //     const dialog = await screen.findByRole('dialog');
    //     expect(dialog).toBeInTheDocument();
        
    //     await PickerListTestObject.waitForOptionsToBeReady();

    //     expect(await PickerListTestObject.findOptionsText({ busy: false })).toEqual([
    //         'A1',
    //         'A1+',
    //         'A2',
    //         'A2+',
    //         'B1',
    //         'B1+',
    //         'B2',
    //         'B2+',
    //         'C1',
    //         'C1+',
    //         'C2',
    //     ]);

    //     const bodyInput = within(dialog).getByPlaceholderText('Search');
    //     fireEvent.change(bodyInput, { target: { value: 'A' } });

    //     await waitFor(() => expect(PickerListTestObject.getOptions({ busy: false }).length).toBe(4));

    //     expect(await PickerListTestObject.findOptionsText({ busy: false })).toEqual([
    //         'A1',
    //         'A1+',
    //         'A2',
    //         'A2+',
    //     ]);
    // });
});
