import React, { useCallback } from 'react';
import { Filter } from './Filter';
import { Accordion } from '@epam/promo';
import { TableFiltersConfig, DataTableState } from '@epam/uui-core';
import isEqual from 'lodash.isequal';

interface IFiltersProps<TFilter extends Record<string, any>> {
    filters: TableFiltersConfig<TFilter>[];
    tableState: DataTableState<TFilter>;
    setTableState(newState: DataTableState<TFilter>): void;    
}

function FiltersBlockImpl(props: IFiltersProps<any>) {
    const { tableState, setTableState, filters } = props;

    const handleChange = useCallback(
        (newFilter: any) => {
            if (!isEqual(tableState.filter, newFilter)) {
                setTableState({
                    ...tableState,
                    filter: newFilter,
                    checked: [],
                });                    
            }
        },
        [tableState, setTableState],
    );

    return (
        <Accordion title="Filters" mode="inline" padding="18">
            {filters.map((f) => {
                return <Filter filterConfig={ f } value={ tableState.filter } onValueChange={ handleChange } key={ f.columnKey } />;
            })}
        </Accordion>
    );
}

export const FiltersBlock = React.memo(FiltersBlockImpl) as typeof FiltersBlockImpl;
