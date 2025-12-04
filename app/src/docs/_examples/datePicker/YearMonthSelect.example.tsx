import React, { useState, useMemo, useCallback } from 'react';
import { FlexRow, PickerInput, FlexCell } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

type YearMonthValue = {
    month: number | null;
    year: number | null;
};

export default function YearMonthSelectExample() {
    const [value, onValueChange] = useState<YearMonthValue>({ month: null, year: null });

    const months = useMemo(() => {
        const formatter = new Intl.DateTimeFormat(navigator.language || 'en-US', { month: 'long' });
        return Array.from({ length: 12 }, (_, index) => ({
            id: index,
            name: formatter.format(new Date(2000, index, 1)),
        }));
    }, []);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();

        return Array.from({ length: 20 }, (_, index) => ({
            id: currentYear + index,
            name: (currentYear + index).toString(),
        }));
    }, []);

    const monthsDataSource = useArrayDataSource(
        {
            items: months,
        },
        [months],
    );

    const yearsDataSource = useArrayDataSource(
        {
            items: years,
        },
        [years],
    );

    const handleMonthChange = useCallback((month: number | null) => {
        onValueChange((prev) => ({ ...prev, month }));
    }, []);

    const handleYearChange = useCallback((year: number | null) => {
        onValueChange((prev) => ({ ...prev, year }));
    }, []);

    return (
        <FlexCell width={ 400 }>
            <FlexRow columnGap="12" justifyContent="stretch">
                <PickerInput
                    dataSource={ monthsDataSource }
                    value={ value.month }
                    onValueChange={ handleMonthChange }
                    getName={ (item) => item.name }
                    placeholder="Select month"
                    selectionMode="single"
                    valueType="id"
                    sorting={ { field: 'id', direction: 'asc' } }
                    renderFooter={ () => null }
                />
                <PickerInput
                    dataSource={ yearsDataSource }
                    value={ value.year }
                    onValueChange={ handleYearChange }
                    getName={ (item) => item.name }
                    placeholder="Select year"
                    selectionMode="single"
                    valueType="id"
                    sorting={ { field: 'id', direction: 'asc' } }
                    renderFooter={ () => null }
                />
            </FlexRow>
        </FlexCell>
    );
}
