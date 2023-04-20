import React from 'react';
import { Accordion } from '../Accordion';
import renderer from 'react-test-renderer';
import { systemIcons } from '../../../icons/icons';

describe('Accordion', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Accordion title="Test title" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<Accordion title="Test title" mode="inline" dropdownIcon={systemIcons['60'].foldingArrow} padding="18" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
