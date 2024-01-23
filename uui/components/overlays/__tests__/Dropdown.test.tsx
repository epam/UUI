import React from 'react';
import { Dropdown } from '../Dropdown';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Button } from '../../buttons';

describe('Dropdown', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Dropdown
                renderTarget={ (props) => <Button caption="Test" { ...props } /> }
                renderBody={ jest.fn() }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with more props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Dropdown
                renderTarget={ (props) => <Button caption="Test" { ...props } /> }
                renderBody={ jest.fn() }
                onClose={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
