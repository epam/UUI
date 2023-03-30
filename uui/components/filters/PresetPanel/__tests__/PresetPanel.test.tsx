import React from "react";
import { renderWithContextAsync } from "@epam/test-utils";
import { PresetsPanel } from "../PresetsPanel";

describe('PresetsPanel', () => {
    it('should render correctly', async () => {
        const component = await renderWithContextAsync(
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
