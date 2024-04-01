import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Checkbox } from '@epam/uui';

describe('TestComponent', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Checkbox value={ true } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Checkbox value={ null } onValueChange={ jest.fn } size="18" mode="cell" />);
        expect(tree).toMatchSnapshot();
    });
});
