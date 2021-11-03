import React, { useCallback, useEffect, useState } from "react";
import css from "./FilterPanel.scss";
import { FlexRow, IconButton, ScrollBars, Text } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { cx, DataColumnProps } from "@epam/uui";

import { ITableFilter, ITableState } from "../types";
import { PresetsBlock } from "./PresetsBlock";
import { FiltersBlock } from "./FiltersBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";
import { Presets } from "../Presets";

// import { GroupingBlock } from "./GroupingBlock";

interface IFilterPanelProps extends ITableState {
    columns: DataColumnProps<any>[];
    filters: ITableFilter[];
    onToggle(isOpened: boolean): void;
}

const timeout = 500;

const FilterPanel: React.FC<IFilterPanelProps> = props => {
    const [isOpened, setIsOpened] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [panelStyleModifier, setPanelStyleModifier] = useState<"show" | "hide">("hide");

    const openPanel = useCallback(() => {
        setIsOpened(true);
        setIsButtonVisible(false);
        setPanelStyleModifier("show");
        props.onToggle(true);
    }, []);

    const closePanel = useCallback(() => {
        return Promise.resolve()
            .then(() => {
                setPanelStyleModifier("hide");
                props.onToggle(false);
            })
            .then(() => {
                setTimeout(() => {
                    setIsOpened(false);
                    setIsButtonVisible(true);
                }, timeout);
            });
    }, []);

    return (
        <>
            { isButtonVisible && (
                <FlexRow background="white" borderBottom cx={ css.iconContainer }>
                    <IconButton
                        icon={ filterIcon }
                        color="gray50"
                        cx={ [css.icon] }
                        onClick={ openPanel }
                    />
                </FlexRow>
            ) }

            { isOpened && (
                <div className={ cx(css.container, css.filterSidebarPanelWrapper, panelStyleModifier, { [css.containerOpened]: isOpened }) }>
                    <FlexRow background="white" borderBottom size="48" padding="18">
                        <Text fontSize="18" font="sans-semibold">Views</Text>
                        <FlexSpacer/>
                        <IconButton icon={ closeIcon } onClick={ closePanel }/>
                    </FlexRow>

                    <ScrollBars>
                        <PresetsBlock
                            presets={ props.presets }
                            createNewPreset={ props.createNewPreset }
                            isDefaultPresetActive={ props.isDefaultPresetActive }
                            resetToDefault={ props.resetToDefault }
                            getActivePresetId={ props.getActivePresetId }
                            hasPresetChanged={ props.hasPresetChanged }
                            choosePreset={ props.choosePreset }
                        />
                        <FiltersBlock
                            filter={ props.tableState.filter }
                            onFilterChange={ props.onFilterChange }
                            filters={ props.filters }
                        />
                        <ColumnsBlock
                            columnsConfig={ props.tableState.columnsConfig }
                            onColumnsConfigChange={ props.onColumnsConfigChange }
                            columns={ props.columns }
                        />
                        { /*<GroupingBlock/>*/ }
                    </ScrollBars>
                </div>
            ) }
        </>
    );
};

export default React.memo(FilterPanel);