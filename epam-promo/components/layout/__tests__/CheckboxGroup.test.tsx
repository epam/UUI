import React from 'react';
import { CheckboxGroup } from '../CheckboxGroup';
import renderer from 'react-test-renderer';

describe('CheckboxGroup', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<CheckboxGroup
                value={ null }
                onValueChange={ () => {} }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<CheckboxGroup
                value={ null }
                onValueChange={ () => {} }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }
                direction='horizontal'
                isDisabled
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});