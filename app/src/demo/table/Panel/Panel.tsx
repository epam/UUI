import React, { ReactEventHandler, useCallback } from "react";
import css from "./Panel.scss";
import { Accordion, IconContainer } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import plusIcon from "@epam/assets/icons/common/content-add-outline-18.svg";
import { Grouping } from "./Grouping";
import { Presets } from "./Presets";
import { Columns } from "./Columns";
import { Filters } from "./Filters";

interface IPanelProps {
    isOpened: boolean;
}

const Panel: React.FC<IPanelProps> = ({ isOpened }) => {
    const addPreset: ReactEventHandler<HTMLDivElement> = useCallback(event => {
        event.stopPropagation();
    }, []);

    const renderAddPresetIcon = useCallback(() => {
        return (
            <>
                <FlexSpacer/>
                <IconContainer icon={ plusIcon } cx={ [css.icon] } onClick={ addPreset }/>
            </>
        );
    }, []);

    if (!isOpened) return null;

    return (
        <div className={ css.container }>
            <Accordion
                title="Presets"
                mode="inline"
                cx={ [css.accordion] }
                padding="18"
                renderAdditionalItems={ renderAddPresetIcon }
            >
                <Presets/>
            </Accordion>

            <Accordion title="Filters" mode="inline" cx={ [css.accordion] } padding="18">
                <Filters/>
            </Accordion>

            <Accordion title="Columns" mode="inline" cx={ [css.accordion] } padding="18">
                <Columns/>
            </Accordion>

            <Accordion title="Grouping" mode="inline" cx={ [css.accordion] } padding="18">
                <Grouping/>
            </Accordion>
        </div>
    );
};

export default React.memo(Panel);