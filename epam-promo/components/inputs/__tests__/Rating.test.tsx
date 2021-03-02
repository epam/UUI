import React from 'react';
import { Rating } from '../Rating';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('Rating', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Rating
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Rating
                value={ null }
                onValueChange={ jest.fn }
                size={ 18 }
                step={ 1 }
                from={ 2 }
                to={ 4 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


