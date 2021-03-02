import React from 'react';
import renderer from 'react-test-renderer';
import { Dropdown } from '../Dropdown';
import { Button } from '../../buttons';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('Dropdown', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Dropdown
                renderTarget={ props => <Button caption='Test' { ...props } /> }
                renderBody={  jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', () => {
        const tree = renderer
            .create(<Dropdown
                renderTarget={ props => <Button caption='test' { ...props } /> }
                renderBody={ jest.fn() }
                onClose={ jest.fn() }
                stopCloseSelectors={ ['test-selector'] }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


