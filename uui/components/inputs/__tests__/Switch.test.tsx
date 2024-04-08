import React from 'react';
import { Switch } from '../Switch';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Switch', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Switch value={ null } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Switch
                value={ null }
                onValueChange={ jest.fn }
                size="18"
                label="Open"
                isDisabled={ true }
                isReadonly={ true }
                isRequired={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
