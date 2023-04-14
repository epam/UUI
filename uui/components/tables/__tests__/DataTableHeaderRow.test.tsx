import React from 'react';
import { DataTableHeaderRow } from '../DataTableHeaderRow';
import renderer from 'react-test-renderer';

describe('DataTableHeaderRow', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableHeaderRow
                value={ null }
                onValueChange={ jest.fn }
                columns={ [] }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableHeaderRow
                value={ {
                    topIndex: 0,
                    visibleCount: 10,
                } }
                onValueChange={ jest.fn }
                columns={ [] }
                size='42'
                textCase='upper'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


