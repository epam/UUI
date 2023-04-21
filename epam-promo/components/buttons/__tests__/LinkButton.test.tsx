import React from 'react';
import { LinkButton } from '../LinkButton';
import { SvgMock, renderSnapshotWithContextAsync } from '@epam/test-utils';

describe('LinkButton', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<LinkButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LinkButton color="blue" onClick={ jest.fn } icon={ SvgMock } isDisabled={ false } isDropdown onClear={ jest.fn } />,
        );
        expect(tree).toMatchSnapshot();
    });
});
