import React from 'react';
import { RadioInput } from '../RadioInput';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('RadioInput', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<RadioInput value={ null } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with maximum', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <RadioInput
                value={ null }
                onValueChange={ jest.fn }
                size="18"
                label="Open"
                isDisabled={ true }
                isInvalid={ true }
                isReadonly={ true }
                isRequired={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
