import { useCallback, useState } from "react";
import { DataTableState } from "@epam/uui";
import { svc } from "../../../services";
import { PersonsTableState } from "../types";
import { parseFilterUrl, normalizeFilter } from "../helpers";

export const useTableValue = <T extends DataTableState>(initialState: T) => {
    const [value, setValue] = useState<PersonsTableState>({
        filter: parseFilterUrl(),
        ...initialState,
    });

    const onValueChange = useCallback((value: PersonsTableState) => {
        const newValue = { ...value, filter: normalizeFilter(value.filter) };
        setValue(newValue);
        
        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            filter: encodeURIComponent(JSON.stringify(newValue.filter)),
        };

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, []);

    return [value, onValueChange, setValue] as const;
};