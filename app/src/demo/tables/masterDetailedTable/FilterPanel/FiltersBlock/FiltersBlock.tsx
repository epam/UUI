import React, { useCallback } from 'react';
import { Filter } from './Filter';
import { Accordion } from '@epam/promo';
import { TableFiltersConfig, IEditable } from '@epam/uui-core';

interface IFiltersProps<TFilter extends Record<string, any>> extends IEditable<TFilter> {
    filters: TableFiltersConfig<TFilter>[];
}

function FiltersBlockImpl(props: IFiltersProps<any>) {
    const { value, onValueChange, filters } = props;

    const handleChange = useCallback(
        (newFilter: any) => {
            onValueChange({
                ...value,
                ...newFilter,
            });
        },
        [value],
    );

    return (
        <Accordion title="Filters" mode="inline" padding="18">
            {filters.map((f) => {
                return <Filter filterConfig={ f } value={ value } onValueChange={ handleChange } key={ f.columnKey } />;
            })}
        </Accordion>
    );
}

export const FiltersBlock = React.memo(FiltersBlockImpl) as typeof FiltersBlockImpl;
