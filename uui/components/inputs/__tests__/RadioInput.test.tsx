import React from 'react';
import { RadioInput } from '../RadioInput';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('RadioInput', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<RadioInput value={ null } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<RadioInput value={ null } onValueChange={ jest.fn } size="18" label="Open" />);
        expect(tree).toMatchSnapshot();
    });
});
