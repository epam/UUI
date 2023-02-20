import React from 'react';
import renderer from 'react-test-renderer';
import { NumericInput } from '../NumericInput';
import { renderWithContextAsync } from '@epam/test-utils';

describe('NumericInput', () => {
    const onChange = jest.fn();

    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<NumericInput min={1} max={10} value={5} onValueChange={onChange} />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with new props', async () => {
        const tree = await renderWithContextAsync(<NumericInput min={1} max={10} value={5} onValueChange={onChange} size="24" mode="cell" />);
        expect(tree).toMatchSnapshot();
    });
});
