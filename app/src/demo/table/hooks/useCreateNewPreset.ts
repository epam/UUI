import { useCallback } from "react";
import { ITablePreset, PersonsTableState } from "../types";
import { IEditable } from "@epam/uui";

export const useCreateNewPreset = (params: ICreateNewPresetParams) => {
    const { choosePreset, value, onValueChange } = params;

    return useCallback((name: string) => {
        const newId = value.presets.length
            ? Math.max.apply(null, value.presets.map(preset => preset.id)) + 1
            : 1;

        const newPreset: ITablePreset = {
            id: newId,
            name,
            filter: value.filter,
            columnsConfig: value.columnsConfig,
            isReadonly: false,
        };

        onValueChange({
            ...value,
            presets: [...value.presets, newPreset],
        });
        choosePreset(newPreset);
    }, [choosePreset, value.filter, value.columnsConfig]);
};

interface ICreateNewPresetParams extends IEditable<PersonsTableState> {
    choosePreset: (preset: ITablePreset) => void;
}