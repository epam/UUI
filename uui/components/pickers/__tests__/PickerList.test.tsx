import React, { ReactNode } from 'react';
import { ArrayDataSource, AsyncDataSource, CascadeSelection, IDataSource } from '@epam/uui-core';
import {
    renderSnapshotWithContextAsync, setupComponentForTest, screen, within, fireEvent, delay, act, waitFor, prettyDOM,
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

const getModalToggler = async () => {
    const [showAllToggler] = (await screen.findAllByRole('button'))
        .filter((btn) => btn.textContent?.trim()
            .toLowerCase()
            .includes('show all'));
    return showAllToggler;
};

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

    return {
        setProps,
        result,
        mocks,
    };
}

describe('PickerList', () => {
    it('should render with minimum props', async () => {
        await setupPickerListForTest({
            selectionMode: 'single',
        });
        
        const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
        expect(listItems.length).toEqual(10);
        
        const toggler = await getModalToggler();

        fireEvent.click(toggler);
        
        const modal = await screen.findByRole('modal');
        expect((await within(modal).findAllByTestId(/uui-PickerModal-loading-item/)).length).toBeGreaterThan(0);

        const modalListItems = await within(modal).findAllByTestId(/uui-PickerModal-item/);
        
        expect(modalListItems.length).toBe(11);
    });
    
    describe('maxDefaultItems & maxTotalItems', () => {
        it('should render maxDefaultItems initially', async () => {
            const maxDefaultItems = 5;
            await setupPickerListForTest({
                selectionMode: 'single',
                maxDefaultItems,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxDefaultItems);
        });
    
        it('should render 10 items initially by default', async () => {
            await setupPickerListForTest({
                selectionMode: 'single',
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(10);
        });
    
        it('should render maxTotalItems', async () => {
            const maxTotalItems = 5;
            await setupPickerListForTest({
                selectionMode: 'single',
                maxTotalItems,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxTotalItems);
        });
        
        it('should render maxTotalItems items, when it is less then maxDefaultItems', async () => {
            const maxTotalItems = 5;
            await setupPickerListForTest({
                selectionMode: 'single',
                maxTotalItems,
                maxDefaultItems: 10,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxTotalItems);
        });
            
        it('should render maxDefaultItems items, when it is less then maxTotalItems', async () => {
            const maxTotalItems = 15;
            const maxDefaultItems = 5;
            await setupPickerListForTest({
                selectionMode: 'single',
                maxTotalItems,
                maxDefaultItems,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxDefaultItems);
        });
    
        it('should render maxDefaultItems elements if selected items count is less then maxDefaultItems', async () => {
            const maxTotalItems = 15;
            const maxDefaultItems = 5;
            const value = [2];
            await setupPickerListForTest<TestItemType, number>({
                value,
                selectionMode: 'multi',
                maxTotalItems,
                maxDefaultItems,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxDefaultItems);
            
            const checked = listItems
                .map((item) => within(item).queryByTestId(/uui-PickerListItem-checkbox-checked/))
                .filter(Boolean);
            expect(checked).toHaveLength(value.length);
        });

        it('should render maxTotalItems elements if selected items count is more then maxTotalItems', async () => {
            const maxTotalItems = 5;
            const maxDefaultItems = 2;
            const value = [2];
            await setupPickerListForTest<TestItemType, number>({
                value,
                selectionMode: 'multi',
                maxTotalItems,
                maxDefaultItems,
            });
            
            const listItems = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems.length).toEqual(maxDefaultItems);
            
            const checked = listItems
                .map((item) => within(item).queryByTestId(/uui-PickerListItem-checkbox-checked/))
                .filter(Boolean);
            expect(checked).toHaveLength(value.length);
            
            const toggler = await getModalToggler();

            fireEvent.click(toggler);
            
            const modal = await screen.findByRole('modal');
            expect((await within(modal).findAllByTestId(/uui-PickerModal-loading-item/)).length).toBeGreaterThan(0);

            const modalListItems = await within(modal).findAllByTestId(/uui-PickerModal-item/);
            expect(modalListItems.length).toBe(11);
            
            const [, ...rest] = await modalListItems.map((item) => within(item).getByRole('checkbox'));
            
            rest.forEach((checkbox) => {
                fireEvent.click(checkbox);
                expect(checkbox).toBeChecked();
            });

            const select = await within(modal).findByRoleAndText({ role: 'button', text: 'Select' });
            fireEvent.click(select);
            
            expect(modal).not.toBeInTheDocument();
             
            // screen.debug(undefined, Infinity);

            const listItems2 = await screen.findAllByTestId(/uui-PickerListItem-row/);
            expect(listItems2.length).toEqual(maxTotalItems);
        });
    });
});
