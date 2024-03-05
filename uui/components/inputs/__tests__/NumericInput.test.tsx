import React from 'react';
import { NumericInput } from '../NumericInput';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('NumericInput', () => {
    describe('snapshots', () => {
        it('should be rendered with minimum props', async () => {
            const tree = await renderSnapshotWithContextAsync(<NumericInput value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } />);
            expect(tree).toMatchSnapshot();
        });

        it('should be rendered with maximum props', async () => {
            const tree = await renderSnapshotWithContextAsync(<NumericInput value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } size="36" mode="inline" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
