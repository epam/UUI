import React from 'react';
import { SvgCircleProgress } from '../SvgCircleProgress';
import renderer from 'react-test-renderer';

describe('SvgCircleProgress', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<SvgCircleProgress progress={ 35 } size={ 30 } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});