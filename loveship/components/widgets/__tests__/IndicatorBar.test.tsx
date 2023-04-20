import React from 'react';
import { IndicatorBar } from '../IndicatorBar';
import renderer from 'react-test-renderer';

describe('IndicatorBar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<IndicatorBar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<IndicatorBar progress={ 20 } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
