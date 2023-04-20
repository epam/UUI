import React from 'react';
import renderer from 'react-test-renderer';
import { IconButton } from '../IconButton';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('IconButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<IconButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<IconButton color="sun" onClick={ jest.fn() } icon={ AcceptIcon } isDisabled={ false } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
