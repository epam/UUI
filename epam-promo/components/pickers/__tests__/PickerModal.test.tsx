import React from 'react';
import renderer from 'react-test-renderer';
import { PickerModal } from '../PickerModal';
import { ArrayDataSource } from '@epam/uui';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

const languageLevels = [
    { "id": 2, "level": "A1" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 5, "level": "A2+" },
    { "id": 6, "level": "B1" },
    { "id": 7, "level": "B1+" },
    { "id": 8, "level": "B2" },
    { "id": 9, "level": "B2+" },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

describe('PickerModal', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerModal
                key='test'
                valueType='id'
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode='single'
                initialValue={ null }
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerModal
                key='test'
                valueType='id'
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode='multi'
                initialValue={ [] }
                isActive
                getName={ item => item.level }
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


