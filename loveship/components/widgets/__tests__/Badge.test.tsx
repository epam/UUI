import React from 'react';
import renderer from 'react-test-renderer';
import { Badge } from '../Badge';
import { systemIcons } from '../../icons/icons';
const acceptIcon = systemIcons[18].accept;

describe('Badge', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Badge />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(
                <Badge
                    shape="square"
                    fill="light"
                    size="12"
                    caption="Test badge"
                    icon={acceptIcon}
                    count={12}
                    onIconClick={jest.fn()}
                    onClick={jest.fn()}
                    onClear={jest.fn()}
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
