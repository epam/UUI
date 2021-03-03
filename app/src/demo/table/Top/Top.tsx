import React, {useCallback} from "react";
import css from "./Top.scss";
import {FlexRow, IconButton, Text} from "@epam/promo";
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import {Presets} from "./Presets";
import {presets} from "../data";

interface ITopProps {
    isPanelOpened: boolean;
    togglePanel: (isOpened: boolean) => void;
}

const Top: React.FC<ITopProps> = ({isPanelOpened, togglePanel}) => {
    const openPanel = useCallback(() => togglePanel(true), [togglePanel]);
    const closePanel = useCallback(() => togglePanel(false), [togglePanel]);
    
    return (
        <FlexRow background="white">
            { isPanelOpened
                ? (
                    <FlexRow cx={ css.views } padding="18">
                        <Text fontSize="18" cx={ [css.title] }>Views</Text>
                        <IconButton icon={ closeIcon } color="gray50" onClick={ closePanel }/>
                    </FlexRow>
                )
                : (
                    <div className={ css.icon_container }>
                        <IconButton icon={ filterIcon } color="gray50" cx={ [css.icon] } onClick={ openPanel }/>
                    </div>
                ) }

            <Presets presets={ presets }/>
        </FlexRow>
    );
};

export default React.memo(Top);