import React from "react";
import css from "./FilterPanel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { DataColumnProps, IEditable } from "@epam/uui";

import { ITableFilter, ITablePreset, PersonsTableState } from "../types";
import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";

// import { GroupingBlock } from "./GroupingBlock";

interface IFilterPanelProps extends IEditable<PersonsTableState> {
    close: () => void;
    filters: ITableFilter[];
    columns: DataColumnProps<any>[];
}

const FilterPanel: React.FC<IFilterPanelProps> = ({ close, filters, value, onValueChange, columns }) => {
    return (
        <div className={ css.container }>
            <FlexRow borderBottom size="48" padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer/>
                <IconButton icon={ closeIcon } onClick={ close }/>
            </FlexRow>
            <ScrollBars>
                <PresetsBlock
                    value={ value }
                    onValueChange={ onValueChange }
                    columns={ columns }
                />
                <FiltersBlock
                    value={ value }
                    onValueChange={ onValueChange }
                    filters={ filters }
                />
                <ColumnsBlock
                    value={ value }
                    onValueChange={ onValueChange }
                    columns={ columns }
                />
                { /*<GroupingBlock/>*/ }
            </ScrollBars>
        </div>
    );
};

export default React.memo(FilterPanel);