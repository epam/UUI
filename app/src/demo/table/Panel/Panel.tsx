import React, {useCallback} from "react";
import css from "./Panel.scss";
import {Accordion} from "@epam/promo";
import {Grouping} from "./Grouping";
import {Presets} from "./Presets";
import {Columns} from "./Columns";
import {Filters} from "./Filters";

interface IPanelProps {
    isOpened: boolean;
}

const Panel: React.FC<IPanelProps> = ({isOpened}) => {
    if (!isOpened) return null;
    
    return (
        <div className={ css.container }>
            <Accordion title="Presets" mode="inline" cx={ [css.accordion] }>
                <Presets/>
            </Accordion>

            <Accordion title="Filters" mode="inline" cx={ [css.accordion] }>
                <Filters/>
            </Accordion>

            <Accordion title="Columns" mode="inline" cx={ [css.accordion] }>
                <Columns/>
            </Accordion>

            <Accordion title="Grouping" mode="inline" cx={ [css.accordion] }>
                <Grouping/>
            </Accordion>
        </div>
    );
};

export default React.memo(Panel);