import React from 'react';
import { Accordion } from '../Accordion';
import renderer from 'react-test-renderer';
import { ReactComponent as Arrow } from '@epam/assets/icons/common/navigation-arrow-down-24.svg';

describe('Accordion', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Accordion title="Test title" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<Accordion title="Test title" mode="inline" dropdownIcon={Arrow} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
