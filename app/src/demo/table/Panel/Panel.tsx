import React from "react";
import css from "./Panel.scss";
import { FlexRow, IconButton, Text } from "@epam/promo";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";

import { ITableFilter } from "../types";
import { Grouping } from "./Grouping";
import { Presets } from "./Presets";
import { Columns } from "./Columns";
import { Filters } from "./Filters";

interface IPanelProps {
    close: () => void;
    filters: ITableFilter[];
}

const Panel: React.FC<IPanelProps> = ({ close, filters }) => {
    return (
        <div className={ css.container }>
            <FlexRow cx={ css.views } padding="18">
                <Text fontSize="18" font="sans-semibold">Views</Text>
                <IconButton icon={ closeIcon } color="gray50" onClick={ close }/>
            </FlexRow>

            <div>
                <Presets/>
                <Filters filters={ filters }/>
                <Columns/>
                <Grouping/>
            </div>
        </div>
    );
};

export default React.memo(Panel);