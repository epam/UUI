import React from 'react';
import { PageButton } from '../PageButton';
import renderer from 'react-test-renderer';

describe('PageButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PageButton size={ '30' } key={ 5 } caption={ '...' } fill='light' color='blue' />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<PageButton
                size='24'
                key={ 1 }
                caption={ 1 }
                onClick={ () => {} }
                fill='white'
                color={ 'blue' } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

