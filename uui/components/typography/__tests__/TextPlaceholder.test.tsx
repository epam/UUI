import React from 'react';
import { TextPlaceholder } from '../TextPlaceholder';
import { renderer } from '@epam/uui-test-utils';

describe('TextPlaceholder', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('should be rendered correctly', () => {
        const tree = renderer.create(<TextPlaceholder />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer.create(<TextPlaceholder wordsCount={ 5 } isNotAnimated />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
