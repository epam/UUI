import React from 'react';
import { TabButton } from '../TabButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as calendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('TabButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TabButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TabButton
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                withNotify={ true }
                isActive={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
