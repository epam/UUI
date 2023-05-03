import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { LinkButton } from '../LinkButton';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('LinkButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<LinkButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<LinkButton color="sun" onClick={ jest.fn() } icon={ AcceptIcon } isDisabled={ false } isDropdown onClear={ jest.fn() } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
