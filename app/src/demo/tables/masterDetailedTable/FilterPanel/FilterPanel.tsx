import React from 'react';
import { DataColumnProps, TableFiltersConfig, ITableState } from '@epam/uui-core';
import {
    FlexRow, IconButton, ScrollBars, Text, FlexSpacer,
} from '@epam/uui';
import { ReactComponent as CloseIcon } from '@epam/assets/icons/common/navigation-close-24.svg';

// import { PresetsBlock } from './PresetsBlock';
import { FiltersBlock } from './FiltersBlock';
// import { ColumnsBlock } from './ColumnsBlock';
import { GroupingBlock } from './GroupingBlock';

export interface IFilterPanelProps<TFilter> extends ITableState<TFilter> {
    columns: DataColumnProps[];
    filters: TableFiltersConfig<TFilter>[];
    closePanel(): void;
}

function FilterPanel<TFilter extends { groupBy?: string[] } = any>(props: IFilterPanelProps<TFilter>) {
    return (
        <>
            <FlexRow borderBottom size="48" padding="18">
                <Text fontSize="18" fontWeight="600">
                    Views
                </Text>
                <FlexSpacer />
                <IconButton icon={ CloseIcon } onClick={ props.closePanel } />
            </FlexRow>

            <ScrollBars>
                {/* <PresetsBlock { ...props } /> */}
                <FiltersBlock filters={ props.filters } tableState={ props.tableState } setTableState={ props.setTableState } />
                {/* <ColumnsBlock columnsConfig={ props.tableState.columnsConfig } onColumnsConfigChange={ props.setColumnsConfig } columns={ props.columns } /> */}
                <GroupingBlock tableState={ props.tableState } setTableState={ props.setTableState } />
            </ScrollBars>
        </>
    );
}

export default React.memo(FilterPanel) as typeof FilterPanel;
