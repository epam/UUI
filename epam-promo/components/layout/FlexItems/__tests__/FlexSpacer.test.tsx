import React from 'react';
import { FlexSpacer } from '../FlexSpacer';
import renderer from 'react-test-renderer';

describe('FlexSpacer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<FlexSpacer />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});