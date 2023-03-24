import React from 'react';
import { ScrollBars } from '../ScrollBars';
import renderer from 'react-test-renderer';
import { Button } from '../../buttons';

describe('ScrollBars', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ScrollBars>
                <Button />
            </ScrollBars>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});