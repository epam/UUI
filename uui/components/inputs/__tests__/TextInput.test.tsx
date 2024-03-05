import React from 'react';
import { TextInput } from '../TextInput';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('TextInput', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TextInput value={ null } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TextInput value={ null } onValueChange={ jest.fn } onAccept={ jest.fn } onCancel={ jest.fn } icon={ CalendarIcon } iconPosition="right" size="36" isDropdown isOpen />,
        );

        expect(tree).toMatchSnapshot();
    });
});
