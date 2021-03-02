import React from 'react';
import { PickerInput } from '../PickerInput';
import renderer from 'react-test-renderer';
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

describe('PickerInput', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerInput
                value={ null }
                onValueChange={ jest.fn }
                selectionMode='single'
                dataSource={ mockDataSource }
                disableClear
                searchPosition='input'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerInput
                value={ [1, 2] }
                onValueChange={ jest.fn }
                selectionMode='multi'
                dataSource={ mockDataSource }
                size='48'
                maxItems={ 20 }
                editMode='modal'
                valueType={ 'id' }
                getName={ item => item.level }
                autoFocus
                placeholder='Test placeholder'
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
                searchPosition='body'
                minBodyWidth={ 900 }
                renderNotFound={ ({ search, onClose = jest.fn }) => <div onClick={ onClose }>{ `No found ${ search }` }</div> }
                renderFooter={ props => <div>{ props }</div> }
                cascadeSelection
                dropdownHeight={ 48 }
                minCharsToSearch={ 4 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


