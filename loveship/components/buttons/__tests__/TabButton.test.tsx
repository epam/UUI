import React from 'react';
import { TabButton } from '../TabButton';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/uui-test-utils';

describe('TabButton', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<TabButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TabButton onClick={ jest.fn() } icon={ SvgMock } isDisabled={ false } />,
        );
        expect(tree).toMatchSnapshot();
    });
});
