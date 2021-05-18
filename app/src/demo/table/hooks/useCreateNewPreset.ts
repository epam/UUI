import { useCallback } from "react";
import { ITablePreset, PersonsTableState } from "../types";

export const useCreateNewPreset = (params: ICreateNewPresetParams) => {
    const {presets, onPresetsChange, choosePreset, value} = params;
    
    return useCallback((name: string) => {
        const newId = presets.length
            ? Math.max.apply(null, presets.map(preset => preset.id)) + 1
            : 1;

        const newPreset: ITablePreset = {
            id: newId,
            name,
            filter: value.filter,
            columnsConfig: value.columnsConfig,
            isReadonly: false,
        };

        onPresetsChange([...presets, newPreset]);
        choosePreset(newPreset);
    }, [presets, onPresetsChange, choosePreset, value.filter, value.columnsConfig]);
};

interface ICreateNewPresetParams {
    presets: ITablePreset[];
    onPresetsChange: (presets: ITablePreset[]) => void;
    choosePreset: (preset: ITablePreset) => void;
    value: PersonsTableState;
}