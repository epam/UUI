import React from 'react';
import { TabButton } from '../TabButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as calendarIcon } from '../../../icons/calendar-18.svg';

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
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
