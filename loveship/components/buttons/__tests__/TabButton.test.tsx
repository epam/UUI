import React from 'react';
import renderer from 'react-test-renderer';
import { TabButton } from '../TabButton';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('TabButton', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<TabButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<TabButton onClick={jest.fn()} icon={AcceptIcon} isDisabled={false} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
