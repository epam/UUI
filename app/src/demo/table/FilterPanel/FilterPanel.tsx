import React from "react";
import css from "./FilterPanel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";

import { ITableFilter, PersonsTableState } from "../types";
// import { GroupingBlock } from "./GroupingBlock";
// import { PresetsBlock } from "./PresetsBlock";
// import { ColumnsBlock } from "./ColumnsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { IEditable } from "@epam/uui";

interface IPanelProps extends IEditable<PersonsTableState> {
    close: () => void;
    filters: ITableFilter[];
}

const FilterPanel: React.FC<IPanelProps> = ({ close, filters, value, onValueChange }) => {
    return (
        <div className={ css.container }>
            <FlexRow borderBottom size='48' padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer/>
                <IconButton icon={ closeIcon } onClick={ close }/>
            </FlexRow>
            <ScrollBars>
                {/*<PresetsBlock/>*/ }
                <FiltersBlock filters={ filters } value={ value } onValueChange={ onValueChange }/>
                {/*<ColumnsBlock/>*/ }
                {/*<GroupingBlock/>*/ }
            </ScrollBars>
        </div>
    );
};

export default React.memo(FilterPanel);