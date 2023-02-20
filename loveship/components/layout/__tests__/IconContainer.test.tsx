import React from 'react';
import renderer from 'react-test-renderer';
import { IconContainer } from '../IconContainer';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('IconContainer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<IconContainer icon={AcceptIcon} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<IconContainer color="sun" onClick={jest.fn()} icon={AcceptIcon} size={36} rotate="90ccw" tabIndex={0} flipY />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
