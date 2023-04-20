import React from 'react';
import { Dropdown } from '../Dropdown';
import renderer from 'react-test-renderer';
import { Button } from '../../buttons';

describe('Dropdown', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Dropdown renderTarget={(props) => <Button caption="Test" {...props} />} renderBody={jest.fn()} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer.create(<Dropdown renderTarget={(props) => <Button caption="Test" {...props} />} renderBody={jest.fn()} onClose={jest.fn} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
