import React from "react";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import { DataColumnProps } from "@epam/uui";
import { ReactComponent as CloseIcon } from "@epam/assets/icons/common/navigation-close-24.svg";

import { ITableFilter, ITableState } from "../types";
import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";

// import { GroupingBlock } from "./GroupingBlock";

export interface IFilterPanelProps extends ITableState {
    columns: DataColumnProps<any>[];
    filters: ITableFilter[];
    closePanel(): void;
}

const FilterPanel: React.FC<IFilterPanelProps> = props => {
    return (
        <>
            <FlexRow background="white" borderBottom size="48" padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer/>
                <IconButton icon={ CloseIcon } onClick={ props.closePanel }/>
            </FlexRow>

            <ScrollBars>
                <PresetsBlock
                    presets={ props.presets }
                    createNewPreset={ props.createNewPreset }
                    isDefaultPresetActive={ props.isDefaultPresetActive }
                    resetToDefault={ props.resetToDefault }
                    getActivePresetId={ props.getActivePresetId }
                    hasPresetChanged={ props.hasPresetChanged }
                    choosePreset={ props.choosePreset }
                />
                <FiltersBlock
                    filter={ props.tableState.filter }
                    onFilterChange={ props.onFilterChange }
                    filters={ props.filters }
                />
                <ColumnsBlock
                    columnsConfig={ props.tableState.columnsConfig }
                    onColumnsConfigChange={ props.onColumnsConfigChange }
                    columns={ props.columns }
                />
                { /*<GroupingBlock/>*/ }
            </ScrollBars>
        </>
    );
};

export default React.memo(FilterPanel);