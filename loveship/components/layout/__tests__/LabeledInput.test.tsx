import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { LabeledInput } from '../LabeledInput';
import { TextInput } from '../../inputs';

describe('LabeledInput', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LabeledInput>
                <TextInput value="test" onValueChange={jest.fn()} />
            </LabeledInput>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LabeledInput label="Test label" size="36" info="Test" isInvalid validationMessage="Test invalid message" labelPosition="left">
                <TextInput value="test" onValueChange={jest.fn()} />
            </LabeledInput>
        );

        expect(tree).toMatchSnapshot();
    });
});
