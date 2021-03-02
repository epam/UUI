import React from 'react';
import renderer from 'react-test-renderer';
import { ControlWrapper } from '../ControlWrapper';
import { Button } from '../../buttons';

describe('ControlWrapper', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ControlWrapper size='36'><Button caption='On'/><Button caption='Off' color='green' /></ControlWrapper>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});