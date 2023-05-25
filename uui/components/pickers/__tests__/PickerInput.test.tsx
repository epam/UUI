import React, { ReactNode } from 'react';
import { ArrayDataSource, AsyncDataSource, CascadeSelection } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, delay, waitFor,
    queryHelpers,
} from '@epam/uui-test-utils';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { PickerInputBaseProps } from '@epam/uui-components';

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
    const { result, mocks } = await setupComponentForTest<PickerInputComponentProps<TItem, TId>>(
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
        (props) => <PickerInput { ...props } />,
    );
    const input = screen.queryByRole('textbox');

    return {
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
                getName={ (item) => item.level }
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

    it('[selectionMode multi] should select & clear several options', async () => {
        const { dom, mocks } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
        });
        expect(dom.input.getAttribute('placeholder').trim()).toEqual('Please select');
        fireEvent.click(dom.input);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        const optionC2 = await screen.findByText('C2');
        expect(optionC2).toBeInTheDocument();

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
        fireEvent.click(a1Clear);
        expect(screen.queryAllByRole('button')).toHaveLength(2); // 1 tag and 1 clear button
        fireEvent.click(a1plusClear);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('[selectionMode single] should select & clear option', async () => {
        const { dom, mocks } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
        });
        expect(dom.input.getAttribute('placeholder').trim()).toEqual('Please select');
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
    
    it('[selectionMode single] should render names of items by getName', async () => {
        const { mocks, dom } = await setupPickerInputForTest({
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
    
    it('[selectionMode multi] should render names of items by getName', async () => {
        const { dom } = await setupPickerInputForTest({
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

    it('[selectionMode single] should render entity name in placeholder', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            entityName: 'Language Level',
        });
        
        expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Level');
    });
    
    it('[selectionMode single] should ignore plural entity name in placeholder', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
            entityName: 'Language Level',
            entityPluralName: 'Multiple Language Levels',
        });
        
        expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Level');
    });

    it('[selectionMode multi] should render entity name with \'s\' in placeholder', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            entityName: 'Language Level',
        });
        
        expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Language Levels');
    });

    it('[selectionMode multi] should render plural entity name in placeholder', async () => {
        const { dom } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
            entityName: 'Language Level',
            entityPluralName: 'Multiple Language Levels',
        });
        
        expect(dom.input?.getAttribute('placeholder')?.trim()).toEqual('Please select Multiple Language Levels');
    });

    it.each<[CascadeSelection]>(
        [[false], [true], ['implicit'], ['explicit']],
    )
    ('[selectionMode single] should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
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
    
    it('[selectionMode multi] should pick single element with cascadeSelection = false', async () => {
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
});
