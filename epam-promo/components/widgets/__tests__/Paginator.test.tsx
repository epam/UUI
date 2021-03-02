import React from 'react';
import { Paginator } from '../Paginator';
import renderer from 'react-test-renderer';

describe('Paginator', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Paginator
                value={ null }
                onValueChange={ () => {} }
                totalPages={ 10 }
                size='24'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});