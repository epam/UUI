import React from 'react';
import { PresetActionsDropdown } from '../PresetActionsDropdown';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

const mockPresetActionsDropdownApi = {
    activePresetId: 1,
    choosePreset: jest.fn(),
    createNewPreset: jest.fn(),
    hasPresetChanged: jest.fn(),
    duplicatePreset: jest.fn(),
    deletePreset: jest.fn(),
    updatePreset: jest.fn(),
    getPresetLink: jest.fn(),
    preset: {
        id: 1,
        name: 'Test Preset',
    },
    addPreset: jest.fn(),
    tableState: {},
    renamePreset: jest.fn(),
};

describe('PresetActionsDropdown', () => {
    it('should render correctly', async () => {
        const component = await renderSnapshotWithContextAsync(<PresetActionsDropdown { ...mockPresetActionsDropdownApi } />);
        expect(component).toMatchSnapshot();
    });
});
