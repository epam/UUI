import React from 'react';
import { VerticalTabButton } from '../VerticalTabButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as calendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('VerticalTabButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<VerticalTabButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <VerticalTabButton
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                withNotify={ true }
                caption="Test"
                isActive={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
