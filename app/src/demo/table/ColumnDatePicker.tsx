import React, { useCallback } from "react";
import { IEditable } from "@epam/uui";
import { DatePicker } from "@epam/promo";
import { PersonsTableState } from "./types";

interface IColumnDatePickerProps extends IEditable<PersonsTableState> {
    filterId: string;
}

const ColumnDatePicker: React.FC<IColumnDatePickerProps> = ({ value, onValueChange, filterId }) => {
    const handleChange = useCallback((newValue: string) => {
        onValueChange({
            ...value,
            filter: {
                ...value.filter,
                [filterId]: newValue,
            },
        });
    }, [value, onValueChange, filterId]);

    return (
        <DatePicker
            format="DD/MM/YYYY"
            value={ value.filter[filterId] }
            onValueChange={ handleChange }
        />
    );
};

export default React.memo(ColumnDatePicker);