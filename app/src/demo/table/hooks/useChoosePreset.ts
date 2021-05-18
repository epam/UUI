import { useCallback } from "react";
import { svc } from "../../../services";
import { ITablePreset, PersonsTableState } from "../types";

export const useChoosePreset = (value: PersonsTableState, onValueChange: (value: PersonsTableState) => void) => {
    return useCallback((preset: ITablePreset) => {
        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            presetId: preset.id,
            filter: encodeURIComponent(JSON.stringify(preset.filter)),
        };
        
        if (preset.id === null) delete newQuery.presetId;
        
        onValueChange({
            ...value, 
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
        });

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, [value, onValueChange]);
};