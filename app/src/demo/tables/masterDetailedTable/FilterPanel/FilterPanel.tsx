import React from 'react';
import { DataColumnProps, TableFiltersConfig, ITableState } from "@epam/uui-core";
import { FlexRow, IconButton, ScrollBars, Text, FlexSpacer } from '@epam/uui';
import { ReactComponent as CloseIcon } from '@epam/assets/icons/common/navigation-close-24.svg';

import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";

export interface IFilterPanelProps<TFilter extends Record<string, any>> extends ITableState {
    columns: DataColumnProps[];
    filters: TableFiltersConfig<TFilter>[];
    closePanel(): void;
}

const FilterPanel = <TFilter extends Record<string, any>>(props: IFilterPanelProps<TFilter>) => {
    return (
        <>
            <FlexRow borderBottom size='48' padding='18'>
                <Text fontSize='18' font='semibold'>Views</Text>
                <FlexSpacer/>
                <IconButton icon={ CloseIcon } onClick={ props.closePanel }/>
            </FlexRow>

            <ScrollBars>
                <PresetsBlock { ...props } />
                <FiltersBlock
                    value={ props.tableState.filter }
                    onValueChange={ props.setFilter }
                    filters={ props.filters }
                />
                <ColumnsBlock
                    columnsConfig={ props.tableState.columnsConfig }
                    onColumnsConfigChange={ props.setColumnsConfig }
                    columns={ props.columns }
                />
                { /*<GroupingBlock/>*/ }
            </ScrollBars>
        </>
    );
};

export default React.memo(FilterPanel) as typeof FilterPanel;