import { useCallback } from "react";
import { ITablePreset, PersonsTableState } from "../types";
import { IEditable } from "@epam/uui";
import { svc } from "../../../services";

export const useCreateNewPreset = (params: ICreateNewPresetParams) => {
    const { value, onValueChange } = params;
    
    return useCallback((name: string) => {
        console.log(name);
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

        // onValueChange({
        //     ...value,
        //     presets: [...value.presets, newPreset],
        // });

        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            presetId: newPreset.id,
            filter: encodeURIComponent(JSON.stringify(newPreset.filter)),
        };

        if (newPreset.id === null) delete newQuery.presetId;

        onValueChange({
            ...value,
            filter: newPreset.filter,
            columnsConfig: newPreset.columnsConfig,
            presets: [...value.presets, newPreset],
        });

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, [value.filter, value.columnsConfig, value.presets]);
};

interface ICreateNewPresetParams extends IEditable<PersonsTableState> {
    choosePreset: (preset: ITablePreset) => void;
}