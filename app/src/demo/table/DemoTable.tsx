import React, {useState} from "react";
import css from "./DemoTable.scss";
import {FlexRow} from "@epam/promo";
import {Table} from "./Table";
import {Panel} from "./Panel";
import {Top} from "./Top";

export const DemoTable: React.FC = () => {
    const [isPanelOpened, setIsPanelOpened] = useState(false);

    return (
        <>
            <Top isPanelOpened={ isPanelOpened } togglePanel={ setIsPanelOpened }/>
            <FlexRow alignItems="stretch" spacing={ null } cx={ css.row }>
                <Panel isOpened={ isPanelOpened }/>
                <Table/>
            </FlexRow>
        </>
    );
};