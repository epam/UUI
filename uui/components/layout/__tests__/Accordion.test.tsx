import React from 'react';
import { Accordion } from '../Accordion';
import { renderer } from '@epam/uui-test-utils';
import { systemIcons } from '../../../icons/icons';

describe('Accordion', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Accordion title="Test title" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(
            <Accordion
                title="Test title"
                mode="inline"
                dropdownIcon={ systemIcons.foldingArrow }
                padding="18"
                isDisabled={ true }
            />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
