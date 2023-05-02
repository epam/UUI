import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { PresetInput } from '../PresetInput';

describe('PresetInput', () => {
    it('should render correctly', async () => {
        const component = await renderSnapshotWithContextAsync(<PresetInput onCancel={ jest.fn() } />);
        expect(component).toMatchSnapshot();
    });
});
