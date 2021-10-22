import React from "react";
import css from "./FilterPanel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { DataColumnProps } from "@epam/uui";

import { ITableFilter, ITableState } from "../types";
import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";

// import { GroupingBlock } from "./GroupingBlock";

interface IFilterPanelProps extends ITableState {
    close: () => void;
    columns: DataColumnProps<any>[];
    filters: ITableFilter[];
}

const FilterPanel: React.FC<IFilterPanelProps> = props => {
    return (
        <div className={ css.container }>
            <FlexRow borderBottom size="48" padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer/>
                <IconButton icon={ closeIcon } onClick={ props.close }/>
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
        </div>
    );
};

export default React.memo(FilterPanel);