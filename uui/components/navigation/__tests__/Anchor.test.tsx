import React from 'react';
import renderer from 'react-test-renderer';
import { Anchor } from '../Anchor';

describe('Anchor', () => {
    it('should rendered correctly', () => {
        const tree = renderer.create(<Anchor>Test Anchor</Anchor>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should rendered with props correctly', () => {
        const tree = renderer
            .create(
                <Anchor href="https://uui.epam.com" isDisabled={true}>
                    Test Anchor
                </Anchor>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
