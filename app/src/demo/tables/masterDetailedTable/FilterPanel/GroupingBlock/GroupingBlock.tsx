import React, { Dispatch, SetStateAction } from 'react';
import { Accordion, PickerList } from '@epam/uui';
import { DataTableState } from '@epam/uui-core';
import { groupingsDataSource } from '../../groupings';

interface GroupingBlockProps<TFilter> {
    tableState: DataTableState<TFilter>;
    setTableState: Dispatch<SetStateAction<DataTableState<TFilter, any>>>;
}

function GroupingBlock<TFilter extends { groupBy?: string[] }>({ tableState, setTableState }: GroupingBlockProps<TFilter>) {
    const groupBy = tableState.filter?.groupBy;
    const onGroupingChange = (newGroupBy: string[]) => {
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
            <PickerList
                dataSource={ groupingsDataSource }
                selectionMode="multi"
                value={ groupBy }
                onValueChange={ onGroupingChange }
                valueType="id"
            />
        </Accordion>
    );
}

export default React.memo(GroupingBlock) as typeof GroupingBlock;
