import React from 'react';
import renderer from 'react-test-renderer';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';
import { VerticalTabButton } from '../VerticalTabButton';

describe('VerticalTabButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<VerticalTabButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<VerticalTabButton onClick={jest.fn()} icon={AcceptIcon} isDisabled={false} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
