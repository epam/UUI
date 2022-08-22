import React, { useCallback } from "react";
import css from "./TabButtonDropdown.scss";
import { ColumnsConfig, IDropdownToggler, ITablePreset, useUuiContext } from "@epam/uui-core";
import { Dropdown, SuccessNotification } from "../../../overlays";
import { PresetDropdownBody } from "./PresetDropdownBody";
import { Button } from "../../../buttons";
import { Text } from "../../../typography";
import { ReactComponent as menuIcon } from "@epam/assets/icons/common/navigation-more_vert-18.svg";

interface ITubButtonDropdownProps {
    preset: ITablePreset;
    isActivePreset: ITablePreset;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    choosePreset: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    renamePreset: (preset: ITablePreset) => void;
    addPreset: () => void;
    resetToDefault: () => void;
    deletePreset: (preset: ITablePreset) => void;
    tableStateFilter: any;
    tableStateColumnConfig: ColumnsConfig;
    updatePreset: (preset: ITablePreset) => void;
}

export const TabButtonDropdown = (props: ITubButtonDropdownProps) => {
    const { uuiNotifications } = useUuiContext();

    const copyUrlToClipboard = async () => {
        await navigator.clipboard.writeText(location.href);
        successNotificationHandler('Link copied!');
    };

    const saveInCurrent = useCallback(async (preset: ITablePreset) => {
        const newPreset = {
            ...preset,
            filter: props.tableStateFilter,
            columnsConfig: props.tableStateColumnConfig,
        };
        await props.updatePreset(newPreset);
        successNotificationHandler('Changes saved!');
    }, [props.tableStateFilter, props.tableStateColumnConfig]);

    const deletePresetHandler = useCallback((preset: ITablePreset) => {
        if (props.isActivePreset && props.isActivePreset.id === preset.id) {
            props.resetToDefault();
        }
        props.deletePreset(preset);
    }, [props.isActivePreset, props.deletePreset, props.resetToDefault]);

    const successNotificationHandler = useCallback((text: string) => {
        uuiNotifications.show((props) => (
            <SuccessNotification { ...props } >
                <Text size="36" font="sans" fontSize="14">{ text }</Text>
            </SuccessNotification>
        ), { position: 'top-right', duration: 3 }).catch(() => null);
    }, [props]);

    const presetDropdownBodyApi = {
        preset: props.preset,
        isActivePreset: props.isActivePreset,
        hasPresetChanged: props.hasPresetChanged,
        choosePreset: props.choosePreset,
        duplicatePreset: props.duplicatePreset,
        renamePreset: props.renamePreset,
        copyUrlToClipboard: copyUrlToClipboard,
        deletePresetHandler: deletePresetHandler,
        addPreset: props.addPreset,
        saveInCurrent: saveInCurrent,
    };

    const renderBody = useCallback(() => <PresetDropdownBody { ...presetDropdownBodyApi } />, [props]);

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
