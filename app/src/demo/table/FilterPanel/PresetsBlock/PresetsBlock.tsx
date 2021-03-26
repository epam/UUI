import React, { ReactEventHandler, useCallback } from "react";
import css from "./PresetsBlock.scss";
import { Accordion, IconContainer } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import plusIcon from "@epam/assets/icons/common/content-add-outline-18.svg";
import { presets } from "../../data";

const PresetsBlock: React.FC = () => {
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
    
    return (
        <Accordion
            title="Presets"
            mode="inline"
            padding="18"
            renderAdditionalItems={ renderAddPresetIcon }
        >
            { presets.map(preset => (
                <div>
                    { preset.name }
                </div>
            )) }
        </Accordion>
    );
};

export default React.memo(PresetsBlock);