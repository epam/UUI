import React from "react";
import css from "./Panel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";

import { ITableFilter } from "../types";
import { Grouping } from "./Grouping";
import { Presets } from "./Presets";
import { Columns } from "./Columns";
import { Filters } from "./Filters";
import { FlexSpacer } from "../../../../../uui-components";

interface IPanelProps {
    close: () => void;
    filters: ITableFilter[];
}

const Panel: React.FC<IPanelProps> = ({ close, filters }) => {
    return (
        <div className={ css.container }>
            <FlexRow borderBottom size='48' padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <FlexSpacer />
                <IconButton icon={ closeIcon } onClick={ close }/>
            </FlexRow>
            <ScrollBars>
                <Presets/>
                <Filters filters={ filters }/>
                <Columns/>
                <Grouping/>
            </ScrollBars>
        </div>
    );
};

export default React.memo(Panel);