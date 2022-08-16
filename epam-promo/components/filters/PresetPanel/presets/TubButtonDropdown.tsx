import React, { useCallback } from "react";
import css from "../PresetPanel.scss";
import { IDropdownToggler, ITablePreset } from "@epam/uui-core";
import { Dropdown } from "../../../overlays";
import { PresetDropdownBody } from "./PresetDropdownBody";
import { Button } from "../../../buttons";
import { ReactComponent as menuIcon } from "@epam/assets/icons/common/navigation-more_vert-18.svg";

interface ITubButtonDropdownProps {
    preset: ITablePreset;
    isActivePreset: ITablePreset;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    choosePreset: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    renamePreset: (preset: ITablePreset) => void;
    copyUrlToClipboard: () => void;
    deletePresetHandler: (preset: ITablePreset) => void;
    addPreset: () => void;
    saveInCurrent: (preset: ITablePreset) => void;
}

export const TubButtonDropdown = (props: ITubButtonDropdownProps) => {

    const renderTarget = useCallback((props: IDropdownToggler) => {
        return (
            <Button { ...props }
                    cx={ css.presetDropdown }
                    fill="light"
                    icon={ menuIcon }
                    size="36"
                    isDropdown={ false }
            />
        );
    }, [props]);

    const renderBody = useCallback(() => {
        return (
            <PresetDropdownBody
                preset={ props.preset }
                isActivePreset={ props.isActivePreset }
                hasPresetChanged={ props.hasPresetChanged }
                choosePreset={ props.choosePreset }
                duplicatePreset={ props.duplicatePreset }
                renamePreset={ props.renamePreset }
                copyUrlToClipboard={ props.copyUrlToClipboard }
                deletePresetHandler={ props.deletePresetHandler }
                addPreset={ props.addPreset }
                saveInCurrent={ props.saveInCurrent }
            />
        );
    }, [props]);

    return (
        <>
            { props.isActivePreset?.id === props.preset.id &&
                <Dropdown
                    renderBody={ renderBody }
                    renderTarget={ renderTarget }
                    placement="bottom"
                />
            }
        </>
    );
};