import React, { useState } from 'react';
import { PickerModalTestObject, fireEvent, renderSnapshotWithContextAsync, screen, setupComponentForTest, waitFor } from '@epam/uui-test-utils';
import { PickerModal, PickerModalProps } from '../PickerModal';
import { mockDataSource, mockDataSourceAsync, mockSmallDataSource, mockSmallDataSourceAsync, TestItemType } from './mocks';
import { Button, Modals } from '@epam/uui-components';

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

async function setupPickerModalForTest<TItem = TestItemType, TId = number>(params: Partial<PickerModalProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerModalProps<TItem, TId>>(
        (context): PickerModalProps<TItem, TId> => {
            if (params.selectionMode === 'single') {
                return Object.assign({
                    onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('initialValue', newValue)),
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    initialValue: params.initialValue as TId,
                    selectionMode: 'single',
                }, params) as PickerModalProps<TItem, TId>;
            }

            return Object.assign({
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('initialValue', newValue)),
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                initialValue: params.initialValue as number[],
                selectionMode: 'multi',
            }, params) as PickerModalProps<TItem, TId>;
        },
        (props) => {
            const [showModal, setShowModal] = useState(false);
            return (
                <>
                    <Button onClick={ () => setShowModal((show) => !show) }></Button>
                    { showModal && <PickerModal { ...props } /> }
                    <Modals />
                </>
            );
        },
    );
    const toggler = screen.queryByRole('button') as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { toggler, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

describe('PickerModal', () => {
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
                isActive
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
                isActive
                getName={ (item) => item?.level ?? '' }
                filter={ { level: 'A1' } }
                sorting={ { direction: 'desc', field: 'level' } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { dom, result } = await setupPickerModalForTest({
            selectionMode: 'single',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        fireEvent.click(dom.toggler);

        await waitFor(async () => 
            expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

        expect(result.baseElement).toMatchSnapshot();
    });
});
