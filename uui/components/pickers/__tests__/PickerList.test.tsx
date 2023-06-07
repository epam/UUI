import React, { ReactNode } from 'react';
import { ArrayDataSource, AsyncDataSource, CascadeSelection, IDataSource } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, delay, act, waitFor,
} from '@epam/uui-test-utils';
import { Modals, PickerListBaseProps } from '@epam/uui-components';
import { Button, DataPickerRow, FlexCell, PickerItem, Text } from '@epam/promo';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { IHasEditMode } from '../../types';
import { PickerList, PickerListProps } from '../PickerList';

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

type PickerListComponentProps<TItem, TId> = PickerListBaseProps<TItem, TId> & PickerListProps<TItem, TId>;

async function setupPickerListForTest<TItem = TestItemType, TId = number>(params: Partial<PickerListComponentProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerListComponentProps<TItem, TId>>(
        (context): PickerListComponentProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                    value: params.value as TId,
                    selectionMode: 'single',
                    dataSource: mockDataSourceAsync,
                }, params) as PickerListComponentProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                value: params.value as TId,
                selectionMode: 'multi',
                dataSource: mockDataSourceAsync,
            }, params) as PickerListComponentProps<TItem, TId>;
        },
        (props) => (
            <>
                <PickerList { ...props } />
                <Modals />
            </>
        ),
    );
            
    const [showAllToggler] = (await screen.findAllByRole('button'))
        .filter((btn) => btn.textContent?.trim()
            .toLocaleLowerCase()
            .includes('show all'));

    return {
        setProps,
        result,
        mocks,
        dom: { showAllToggler },
    };
}

describe('PickerInput', () => {
    it('should render with minimum props', async () => {
        const { dom } = await setupPickerListForTest({
            value: undefined,
            selectionMode: 'single',
            entityName: 'Language Level',
            entityPluralName: 'Multiple Language Levels',
        });
        
        // expect(dom.input.getAttribute('placeholder')?.trim()).toEqual('Please select Language Level');
    });
});
