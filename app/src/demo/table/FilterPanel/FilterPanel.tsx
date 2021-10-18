import React from "react";
import css from "./FilterPanel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { DataColumnProps, IEditable } from "@epam/uui";

import { IPresetsApi, ITableFilter, ITablePreset, ITableStateApi, PersonsTableState } from "../types";
import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";

// import { GroupingBlock } from "./GroupingBlock";

interface IFilterPanelProps {
    close: () => void;
    tableStateApi: ITableStateApi;
    columns: DataColumnProps<any>[];
    filters: ITableFilter[];
}

const FilterPanel: React.FC<IFilterPanelProps> = ({ close, tableStateApi, filters, columns }) => {
    return (
        <div className={ css.container }>
            <FlexRow borderBottom size="48" padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer/>
                <IconButton icon={ closeIcon } onClick={ close }/>
            </FlexRow>
            <ScrollBars>
                <PresetsBlock { ...tableStateApi }/>
                <FiltersBlock
                    tableStateApi={ tableStateApi }
                    filters={ filters }
                />
                <ColumnsBlock
                    tableStateApi={ tableStateApi }
                    columns={ columns }
                />
                { /*<GroupingBlock/>*/ }
            </ScrollBars>
        </div>
    );
};

export default React.memo(FilterPanel);