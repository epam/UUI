import React from 'react';
import { DataTableRow } from '../DataTableRow';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('DataTableRow', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableRow
                id='test'
                index={ 1 }
                rowKey='testRowKey'
                columns={ [
                    {
                        key: 'id',
                        caption: 'ID',
                        render: product => <div>{ product }</div>,
                        isSortable: true,
                        isAlwaysVisible: true,
                        grow: 0, shrink: 0, width: 96,
                    },
                ] }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


