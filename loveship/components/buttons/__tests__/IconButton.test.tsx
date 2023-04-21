import React from 'react';
import { IconButton } from '../IconButton';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/test-utils';

describe('IconButton', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<IconButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <IconButton color="sun" onClick={ jest.fn() } icon={ SvgMock } isDisabled={ false } />,
        );
        expect(tree).toMatchSnapshot();
    });
});
