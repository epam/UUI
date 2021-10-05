import React, { useCallback, useMemo } from "react";
import css from "./Presets.scss";
import { Button, FlexRow } from "@epam/promo";
import { IPresetsApi, ITablePreset, PersonsTableState } from "../types";
import { DataColumnProps, IEditable } from "@epam/uui";
import { Preset } from "./Preset";
import { svc } from "../../../services";
import { constants } from "../data";

interface IPresetsProps extends IEditable<PersonsTableState> {
    presetsApi: IPresetsApi;
}

const Presets: React.FC<IPresetsProps> = ({ value, onValueChange, presetsApi }) => {
    const newPresetTitle = "New preset";

    const saveNewPreset = useCallback(() => {
        presetsApi.createNewPreset(newPresetTitle);
    }, [presetsApi.createNewPreset, newPresetTitle]);

    const activePreset = value.presets.find(p => p.id === presetsApi.activePresetId);
    const hasActivePresetChanged = useMemo(() => {
        return !presetsApi.isDefaultPresetActive
            && presetsApi.hasPresetChanged(activePreset);
    }, [presetsApi.isDefaultPresetActive, activePreset, value.filter]);

    return (
        <FlexRow spacing="6" size="48" padding="18" cx={ css.row }>
            <Button
                size="24"
                caption="Default"
                fill={ presetsApi.isDefaultPresetActive ? "solid" : "white" }
                onClick={ presetsApi.isDefaultPresetActive ? null : presetsApi.resetToDefault }
            />
            { value.presets.map(preset => (
                <Preset
                    preset={ preset }
                    isActive={ preset.id === presetsApi.activePresetId }
                    hasChanged={ preset.id === presetsApi.activePresetId && hasActivePresetChanged }
                    choosePreset={ presetsApi.choosePreset }
                    duplicatePreset={ presetsApi.duplicatePreset }
                    deletePreset={ presetsApi.deletePreset }
                    renamePreset={ presetsApi.renamePreset }
                    updatePreset={ presetsApi.updatePreset }
                    key={ preset.id }
                    value={ value }
                    onValueChange={ onValueChange }
                />
            )) }

            { hasActivePresetChanged && (
                <Button
                    caption={ `Save as ${ newPresetTitle }` }
                    onClick={ saveNewPreset }
                    color="green"
                    fill="solid"
                    size="24"
                />
            ) }
        </FlexRow>
    );
};

export default React.memo(Presets);