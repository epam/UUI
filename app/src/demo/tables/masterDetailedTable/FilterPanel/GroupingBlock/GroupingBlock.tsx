import React from 'react';
import { Accordion } from '@epam/uui';
import { DataTableState } from '@epam/uui-core';
import { LinkButton, RadioGroup } from '@epam/promo';
import { Grouping } from '../../types';
import css from './GroupingBlock.module.scss';

interface GroupingBlockProps<TFilter> { 
    groupings: Grouping[];
    tableState: DataTableState<TFilter>;
    setTableState(newState: DataTableState<TFilter>): void;
}

function GroupingBlock<TFilter extends { groupBy?: string }>({ groupings, tableState, setTableState }: GroupingBlockProps<TFilter>) {
    const groupBy = tableState.filter?.groupBy;
    const onGroupingChange = (newGroupBy: string) => {
        if (newGroupBy !== groupBy) {
            setTableState({ 
                ...tableState,
                filter: { ...tableState.filter, groupBy: newGroupBy },
                checked: [],
            });
        }
    };

    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            <RadioGroup value={ groupBy } onValueChange={ onGroupingChange } items={ groupings } cx={ css.radioGroupContainer } />
            <LinkButton caption="CLEAR" onClick={ () => onGroupingChange(undefined) } isDisabled={ groupBy === undefined } />
        </Accordion>
    );
}

export default React.memo(GroupingBlock);
