import React, { ReactNode } from 'react';
import { ArrayDataSource, AsyncDataSource, CascadeSelection } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, delay, waitFor,
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

const data: TestTreeItem[] = [
    { id: 1, name: 'Item 1' },
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

const mockSmallDataSourceAsync = new AsyncDataSource<TestTreeItem, number, any>({
    api: async () => {
        await delay(100);
        return data;
    },
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
                    getName: (item: TestItemType) => item.level,
                    value: params.value as TId,
                    selectionMode: 'single',
                }, params) as PickerInputComponentProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
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
    const input = screen.queryByRole('textbox') as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { input, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

class PickerInputObject {
    static getOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const dialog = within(this.getDialog(props.editMode));
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return dialog.getAllByRole('option', params);
    }

    static async findOptions(props: { busy?: boolean, editMode?: string } = {}) {
        const dialog = within(await this.findDialog(props.editMode));
        const params: any = {};
        if (typeof props.busy !== 'undefined') {
            params.busy = props.busy;
        }
        return await dialog.findAllByRole('option', params);
    }

    static async findOptionsText(props: { busy?: boolean, editMode?: string } = {}) {
        const opts = await this.findOptions(props);
        return opts.map((o) => o.textContent?.trim());
    }

    static async findCheckedOptions() {
        const dialog = within(await this.findDialog());
        return (await dialog.findAllByRole('option')).filter((opt) => {
            return (within(opt).getByRole('checkbox') as HTMLInputElement).checked;
        }).map((e) => e.textContent?.trim());
    }

    static async findUncheckedOptions() {
        const dialog = within(await this.findDialog());
        return (await dialog.findAllByRole('option')).filter((opt) => {
            return !(within(opt).getByRole('checkbox') as HTMLInputElement).checked;
        }).map((e) => e.textContent?.trim());
    }

    static getPlaceholderText(input: HTMLElement) {
        return input.getAttribute('placeholder')?.trim();
    }

    static clearInput(container: HTMLElement) {
        const clearButton = within(container).getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);
    }

    static hasClearInputButton(container: HTMLElement) {
        return !!within(container).queryByRole('button', { name: 'Clear' });
    }

    static async clickSelectAllOptions() {
        const dialog = within(await this.findDialog());
        const selectAllButton = await dialog.findByRole('button', { name: 'SELECT ALL' });
        fireEvent.click(selectAllButton);
    }

    static async clickClearAllOptions() {
        const dialog = within(await this.findDialog());
        const selectAllButton = await dialog.findByRole('button', { name: 'CLEAR ALL' });
        fireEvent.click(selectAllButton);
    }

    static getSelectedTagsText(input: HTMLElement) {
        return this.getSelectedTags(input).map((b) => b.textContent?.trim());
    }

    static removeSelectedTagByText(input: HTMLElement, text: string) {
        const tag = this.getSelectedTags(input).find((b) => b.textContent?.trim() === text);
        const removeTagIcon = tag?.lastElementChild;
        fireEvent.click(removeTagIcon as Element);
    }

    static async clickOptionByText(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(opt);
    }

    static async clickOptionCheckbox(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(within(opt).getByRole('checkbox'));
    }

    static async clickOptionUnfold(optionText: string) {
        const opt = await this.findOption(optionText);
        fireEvent.click(within(opt).getByRole('button', { name: 'Unfold' }));
    }

    static async hasOptions(props?: { busy?: boolean }) {
        return (await this.findOptions(props)).length > 0;
    }

    private static async findDialog(editMode: string = 'dialog') {
        return await screen.findByRole(editMode === 'modal' ? 'modal' : 'dialog');
    }
    
    private static getDialog(editMode: string = 'dialog') {
        return screen.getByRole(editMode === 'modal' ? 'modal' : 'dialog');
    }

    private static async findOption(optionText: string) {
        const dialog = within(await this.findDialog());
        return await dialog.findByRoleAndText({ role: 'option', text: optionText });
    }

    private static getSelectedTags(input: HTMLElement) {
        const tags: HTMLElement[] = [];
        let s = input;
        while ((s = s.previousElementSibling as HTMLElement)) {
            if (s.tagName.toLowerCase() === 'button') {
                tags.push(s);
            }
        }
        return tags.reverse();
    }
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
        it('[valueType id] should select & clear option', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
            });
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
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
        
        it('[valueType entity] should select & clear option', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                valueType: 'entity',
            });
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            expect(mocks.onValueChange).toHaveBeenLastCalledWith({ id: 12, level: 'C2', name: 'Proficiency' });
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

            expect(PickerInputObject.getPlaceholderText(dom.input)).toBeUndefined();
            await waitFor(async () => expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual(languageLevels[1].name));

            fireEvent.click(dom.input);
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

            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
        });

        it('should ignore plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });

            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select Language Level');
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
            fireEvent.click(dom.input);
 
            await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

            // Check parent
            await PickerInputObject.clickOptionByText('Parent 2');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(2);
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Parent 2');
        });

        it('should work with maxItems properly', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 1,
                selectionMode: 'single',
            });

            fireEvent.click(dom.input);

            await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

            // Check parent
            await PickerInputObject.clickOptionByText('A1');
            fireEvent.click(dom.input);
            await PickerInputObject.clickOptionByText('A1+');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith(3);
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('A1+');
        });

        it('should disable clear', async () => {
            const { dom, setProps } = await setupPickerInputForTest({
                value: 2,
                selectionMode: 'single',
                disableClear: false,
            });

            await waitFor(() => expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('A1'));

            const clearButton = within(dom.container).getByRole('button', { name: 'Clear' });
            expect(clearButton).toBeInTheDocument();
            fireEvent.click(clearButton);
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            setProps({ disableClear: true, value: 2 });
            expect(within(dom.container).queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('A1');
        });

        it('should clear selected item', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'single',
                maxItems: 100,
            });
            fireEvent.click(dom.input);

            expect(await PickerInputObject.hasOptions()).toBeTruthy();

            const clearButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
            expect(clearButton).toBeInTheDocument();
            expect(clearButton).toHaveAttribute('aria-disabled', 'true');

            await PickerInputObject.clickOptionByText('A1');
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('A1');

            fireEvent.click(dom.input);

            const clearButton2 = within(screen.getByRole('dialog')).getByRole('button', { name: 'CLEAR' });
            expect(clearButton2).toHaveAttribute('aria-disabled', 'false');

            fireEvent.click(clearButton2);

            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
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
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputObject.clickOptionCheckbox('A1');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);

            await PickerInputObject.clickOptionCheckbox('A1+');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            PickerInputObject.removeSelectedTagByText(dom.input, 'A1+');
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1']);

            PickerInputObject.removeSelectedTagByText(dom.input, 'A1');
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual([]);
        });

        it('[valueType entity] should select & clear several options', async () => {
            const { dom, mocks } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                valueType: 'entity',
            });
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            fireEvent.click(dom.input);
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await PickerInputObject.clickOptionCheckbox('A1');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([{ id: 2, level: 'A1', name: 'Elementary' }]);

            await PickerInputObject.clickOptionCheckbox('A1+');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([
                { id: 2, level: 'A1', name: 'Elementary' },
                { id: 3, level: 'A1+', name: 'Elementary+' },
            ]);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['A1', 'A1+']);

            fireEvent.click(window.document.body);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            PickerInputObject.removeSelectedTagByText(dom.input, 'A1+');
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1']);

            PickerInputObject.removeSelectedTagByText(dom.input, 'A1');
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual([]);
        });
        it('should render names of items by getName', async () => {
            const { dom } = await setupPickerInputForTest<TestItemType, number>({
                value: [3, 4],
                selectionMode: 'multi',
                getName: ({ name }) => name,
            });
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['', '']);
            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select');
            await waitFor(() => expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Elementary+', 'Pre-Intermediate']));
        });

        it('should render entity name with \'s\' in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
            });

            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select Language Levels');
        });

        it('should render plural entity name in placeholder', async () => {
            const { dom } = await setupPickerInputForTest({
                value: undefined,
                selectionMode: 'multi',
                entityName: 'Language Level',
                entityPluralName: 'Multiple Language Levels',
            });

            expect(PickerInputObject.getPlaceholderText(dom.input)).toEqual('Please select Multiple Language Levels');
        });

        it('should pick single element with cascadeSelection = false', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: false,
                dataSource: mockTreeLikeDataSourceAsync,
            });
            fireEvent.click(dom.input);
            expect(await PickerInputObject.hasOptions()).toBeTruthy();
            await PickerInputObject.clickOptionCheckbox('Parent 2');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);

            expect(await PickerInputObject.findCheckedOptions()).toEqual(['Parent 2']);
            expect(await PickerInputObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);
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

            fireEvent.click(dom.input);
            expect(await PickerInputObject.hasOptions()).toBeTruthy();
            // Check parent
            await PickerInputObject.clickOptionCheckbox('Parent 2');
            // Unfold parent
            await PickerInputObject.clickOptionUnfold('Parent 2');
            // Test if checkboxes are checked/unchecked
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 2.1, 2.2, 2.3]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerInputObject.clickOptionCheckbox('Child 2.2');
            // Test if checkboxes are checked/unchecked
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should pick single element with cascadeSelection = implicit', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: 'implicit',
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.input);
            expect(await PickerInputObject.hasOptions()).toBeTruthy();

            // Check parent
            await PickerInputObject.clickOptionCheckbox('Parent 2');
            // Unfold parent
            await PickerInputObject.clickOptionUnfold('Parent 2');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Parent 2']);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerInputObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerInputObject.clickOptionCheckbox('Child 2.2');
            // Test if checkboxes are checked/unchecked
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2.1, 2.3]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputObject.findCheckedOptions()).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerInputObject.findUncheckedOptions()).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });

        it('should wrap up if number of elements is greater than maxItems', async () => {
            const { mocks, dom } = await setupPickerInputForTest({
                value: undefined,
                maxItems: 3,
                entityPluralName: 'languages',
                selectionMode: 'multi',
            });

            fireEvent.click(dom.input);
            expect(await PickerInputObject.hasOptions()).toBeTruthy();

            // Check parent
            await PickerInputObject.clickOptionByText('A1');
            await PickerInputObject.clickOptionByText('A1+');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);

            await PickerInputObject.clickOptionByText('A2');
            await PickerInputObject.clickOptionByText('A2+');
            expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3, 4, 5]);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['4 languages selected']);
        });

        it('should disable clear', async () => {
            const { setProps, dom, result } = await setupPickerInputForTest({
                value: [2, 3],
                selectionMode: 'multi',
                disableClear: false,
            });
            await waitFor(() => expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']));
            PickerInputObject.clearInput(result.container);
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual([]);

            setProps({ disableClear: true, value: [2, 3] });
            expect(PickerInputObject.hasClearInputButton(result.container)).toBeFalsy();
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+']);
        });

        it('should select all', async () => {
            const { dom } = await setupPickerInputForTest({
                value: [],
                selectionMode: 'multi',
                maxItems: 100,
            });

            fireEvent.click(dom.input);
            expect(await PickerInputObject.hasOptions()).toBeTruthy();

            await PickerInputObject.clickSelectAllOptions();
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual(['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2']);

            await PickerInputObject.clickClearAllOptions();
            expect(PickerInputObject.getSelectedTagsText(dom.input)).toEqual([]);
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
        fireEvent.change(dom.input, { target: { value: 'A' } });
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });

    it('should use modal edit mode', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            editMode: 'modal',
        });
        fireEvent.click(dom.input);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(
            await PickerInputObject.findOptionsText({ busy: false, editMode: 'modal' }),
        ).toEqual(
            ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'],
        );
    });

    it('should render input as invalid', async () => {
        const props: PickerInputComponentProps<TestItemType, number> = {
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
            value: undefined,
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
        expect(await PickerInputObject.getPlaceholderText(dom.input)).toEqual('Custom placeholder');
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

        const dialogBody = dialog.firstElementChild;
        expect(dialogBody).toHaveStyle('width: 300px');
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
                    mode="ghost"
                    caption={ props.selection?.map((s) => s.value?.name).join(', ') }
                />
            ),
        });

        expect(dom.target.getAttribute('type')).toBe('button');

        fireEvent.click(dom.target);
        expect(await PickerInputObject.hasOptions()).toBeTruthy();

        await PickerInputObject.clickOptionCheckbox('A1');
        await PickerInputObject.clickOptionCheckbox('A1+');
        expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);

        expect(await PickerInputObject.findCheckedOptions()).toEqual(['A1', 'A1+']);
        expect(screen.getByTestId('test-toggler').textContent?.trim()).toEqual('Elementary, Elementary+');
    });

    it('should render search in input', async () => {
        const { result, dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'input',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });
        
        expect(dom.input.getAttribute('readonly')).toBe('');
        fireEvent.click(dom.input);
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        
        await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

        expect(result.baseElement).toMatchSnapshot();
    });

    it('should render search in body', async () => {
        const { result, dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'body',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        const bodyInput = within(dialog).getByPlaceholderText('Search');
        expect(bodyInput).toBeInTheDocument();
        expect(bodyInput.hasAttribute('readonly')).toBeFalsy();

        await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

        expect(result.baseElement).toMatchSnapshot();
    });

    it('should not render search in none mode', async () => {
        const { result, dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            searchPosition: 'none',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        expect(dom.input.hasAttribute('readonly')).toBeTruthy();
        fireEvent.click(dom.input);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).queryByPlaceholderText('Search')).not.toBeInTheDocument();

        await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

        expect(result.baseElement).toMatchSnapshot();
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

        await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

        expect(await PickerInputObject.findOptionsText({ busy: false })).toEqual([
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
        
        await waitFor(async () => expect(PickerInputObject.getOptions({ busy: false }).length).toBeGreaterThan(0));

        expect(await PickerInputObject.findOptionsText({ busy: false })).toEqual([
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

        await waitFor(() => expect(PickerInputObject.getOptions({ busy: false }).length).toBe(4));

        expect(await PickerInputObject.findOptionsText({ busy: false })).toEqual([
            'A1',
            'A1+',
            'A2',
            'A2+',
        ]);
    });
});
