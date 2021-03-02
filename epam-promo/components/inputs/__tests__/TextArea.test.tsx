import React from 'react';
import { TextArea } from '../TextArea';
import renderer from 'react-test-renderer';

describe('TextArea', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TextArea
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TextArea
                value={ null }
                onValueChange={ jest.fn }
                placeholder='Type here'
                size='36'
                maxLength={ 200 }
                rows={ 4 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


