import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { TextInput } from '../TextInput';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('TextInput', () => {
    const value = 'test';
    const onChange = jest.fn();

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TextInput value={value} onValueChange={onChange} />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TextInput
                value={value}
                onValueChange={onChange}
                onAccept={jest.fn()}
                onCancel={jest.fn()}
                icon={AcceptIcon}
                iconPosition="right"
                isDropdown
                isOpen
                size="60"
            />
        );

        expect(tree).toMatchSnapshot();
    });
});
