import React from 'react';
import { IconButton } from '../IconButton';
import { SvgMock, renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('IconButton', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<IconButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<IconButton color="blue" onClick={ jest.fn } icon={ SvgMock } isDisabled={ false } />);
        expect(tree).toMatchSnapshot();
    });
});
