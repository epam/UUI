import React from 'react';
import { TextPlaceholder } from '../TextPlaceholder';
import { render } from '@epam/uui-test-utils';

describe('TextPlaceholder', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('should be rendered correctly', () => {
        const { asFragment } = render(<TextPlaceholder />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const { asFragment } = render(<TextPlaceholder wordsCount={ 5 } isNotAnimated />);
        expect(asFragment()).toMatchSnapshot();
    });
});
