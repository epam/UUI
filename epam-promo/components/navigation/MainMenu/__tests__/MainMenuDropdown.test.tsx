import React from 'react';
import renderer from 'react-test-renderer';
import { MainMenuDropdown } from '../MainMenuDropdown';
import { MainMenuButton } from '../MainMenuButton';

describe('MainMenuDropdown', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<MainMenuDropdown />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <MainMenuDropdown caption="Test button" estimatedWidth={120} priority={6}>
                    <MainMenuButton collapseToMore caption="Impact" />
                    <MainMenuButton collapseToMore caption="ENGX" />
                    <MainMenuButton collapseToMore caption="Cloud" />
                </MainMenuDropdown>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
