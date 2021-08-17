import React from 'react';
import renderer from 'react-test-renderer';
import { ArrayDataSource } from '@epam/uui';
import { windowMock } from "@epam/test-utils";
import { ColumnPickerFilter } from '../ColumnPickerFilter';

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

describe('ColumnPickerFilter', () => {
    let windowSpy: any;

    beforeEach(() => {
        windowSpy = jest.spyOn(window, "window", "get")
            .mockImplementation(() => windowMock);
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });
    
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ColumnPickerFilter
                selectionMode='single'
                dataSource={ mockDataSource }
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ColumnPickerFilter
                selectionMode='single'
                dataSource={ mockDataSource }
                value={ null }
                onValueChange={ jest.fn }
                valueType='id'
                size='30'
                sorting={ { field: 'level', direction: 'desc' } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


