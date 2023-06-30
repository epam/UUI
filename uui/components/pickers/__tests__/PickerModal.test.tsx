import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { PickerModal } from '../PickerModal';
import { mockDataSource } from './mocks';

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

describe('PickerModal', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockDataSource }
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
                getName={ (item) => item.level }
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
