import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Preset } from '../Preset';

const mockPreset = {
    id: 1,
    name: 'Test Preset',
};

const mockPresetsApi = {
    activePresetId: 1,
    choosePreset: jest.fn(),
    createNewPreset: jest.fn(),
    hasPresetChanged: jest.fn(),
    duplicatePreset: jest.fn(),
    deletePreset: jest.fn(),
    updatePreset: jest.fn(),
    getPresetLink: jest.fn(),
};

const mockTableState = {};

describe('Preset', () => {
    it('renders correctly when not in rename mode and not active', async () => {
        const tree = await renderSnapshotWithContextAsync(<Preset preset={ mockPreset } addPreset={ jest.fn() } tableState={ mockTableState } { ...mockPresetsApi } />);
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly when not in rename mode and active', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Preset
                preset={ mockPreset }
                addPreset={ jest.fn() }
                tableState={ mockTableState }
                activePresetId={ mockPreset.id }
                hasPresetChanged={ jest.fn() }
                choosePreset={ jest.fn() }
                updatePreset={ jest.fn() }
                { ...mockPresetsApi }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
