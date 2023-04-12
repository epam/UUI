import React from "react";
import { renderSnapshotWithContextAsync } from "@epam/test-utils";
import { PresetsPanel } from "../PresetsPanel";

describe('PresetsPanel', () => {
    it('should render correctly', async () => {
        const component = await renderSnapshotWithContextAsync(
            <PresetsPanel
                activePresetId={ 1 }
                choosePreset={ jest.fn() }
                createNewPreset={ jest.fn() }
                tableState={ { } }
                hasPresetChanged={ jest.fn() }
                duplicatePreset={ jest.fn() }
                deletePreset={ jest.fn() }
                updatePreset={ jest.fn() }
                getPresetLink={ jest.fn() }
                presets={ [] }/>,
        );
        expect(component).toMatchSnapshot();
    });
});
