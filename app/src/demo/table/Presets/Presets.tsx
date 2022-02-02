import React, { useCallback, useMemo } from "react";
import css from "./Presets.scss";
import { FlexRow } from "@epam/promo";
import { Button } from "@epam/uui-v";
import { IPresetsApi, ITablePreset } from "../types";
import { Preset } from "./Preset";
import { DataTableState } from "@epam/uui";

interface IPresetsProps extends IPresetsApi {
    presets: ITablePreset[];
    tableState: DataTableState;
}

const Presets: React.FC<IPresetsProps> = ({ tableState, presets, createNewPreset, getActivePresetId, isDefaultPresetActive, hasPresetChanged, resetToDefault, choosePreset, duplicatePreset, deletePreset, updatePreset }) => {
    const newPresetTitle = "New preset";
    const activePresetId = getActivePresetId();

    const saveNewPreset = useCallback(() => {
        createNewPreset(newPresetTitle);
    }, [createNewPreset, newPresetTitle]);

    const activePreset = presets.find(p => p.id === activePresetId);
    const hasActivePresetChanged = useMemo(() => {
        return !isDefaultPresetActive()
            && hasPresetChanged(activePreset);
    }, [isDefaultPresetActive, activePreset, tableState.filter]);
    
    return (
        <FlexRow spacing="6" size="48" padding="18" cx={ css.row }>
            <Button
                size="24"
                caption="Default"
                mode={ isDefaultPresetActive() ? "solid" : "outline" }
                onClick={ isDefaultPresetActive() ? null : resetToDefault }
            />
            { presets.map(preset => (
                <Preset
                    preset={ preset }
                    isActive={ preset.id === activePresetId }
                    hasChanged={ preset.id === activePresetId && hasActivePresetChanged }
                    choosePreset={ choosePreset }
                    duplicatePreset={ duplicatePreset }
                    deletePreset={ deletePreset }
                    updatePreset={ updatePreset }
                    resetToDefault={ resetToDefault }
                    key={ preset.id }
                />
            )) }

            { hasActivePresetChanged && (
                <Button
                    caption={ `Save as ${ newPresetTitle }` }
                    onClick={ saveNewPreset }
                    color="accent"
                    mode="solid"
                    size="24"
                />
            ) }
        </FlexRow>
    );
};

export default React.memo(Presets);