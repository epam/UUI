import React from 'react';
import { FlexCell } from '../FlexCell';
import renderer from 'react-test-renderer';

describe('FlexCell', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FlexCell />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<FlexCell
                onClick={ () => {} }
                width='100%'
                minWidth={ 120 }
                alignSelf='center'
                grow={ 1 }
                shrink={ 1 }
                textAlign='left'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});