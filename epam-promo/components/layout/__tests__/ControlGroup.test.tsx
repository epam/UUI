import React from 'react';
import renderer from 'react-test-renderer';
import { ControlGroup } from '../ControlGroup';
import { Button } from '../../buttons';

describe('ControlGroup', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ControlGroup><Button caption='On'/><Button caption='Off' color='green' /></ControlGroup>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});