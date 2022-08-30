import React, { useCallback } from "react";
import { IconContainer } from '@epam/uui-components';
import css from "./PresetActionsDropdown.scss";
import { IPresetsApi, IDropdownToggler, ITablePreset, useUuiContext, DataTableState } from "@epam/uui-core";
import { Dropdown, DropdownMenuButton, SuccessNotification } from "../../overlays";
import { Text } from "../../typography";
import { ReactComponent as menuIcon } from "@epam/assets/icons/common/navigation-more_vert-18.svg";
import { FlexRow, Panel } from "../../layout";
import { ReactComponent as SaveInCurrentIcon } from "@epam/assets/icons/common/action-update-18.svg";
import { ReactComponent as SaveAsNewIcon } from "@epam/assets/icons/common/save-outline-18.svg";
import { ReactComponent as DiscardChangesIcon } from "@epam/assets/icons/common/content-edit_undo-18.svg";
import { ReactComponent as CopyIcon } from "@epam/assets/icons/common/action-copy_content-18.svg";
import { ReactComponent as RenameIcon } from "@epam/assets/icons/common/content-edit-18.svg";
import { ReactComponent as CopyLinkIcon } from "@epam/assets/icons/common/content-link-18.svg";
import { ReactComponent as DeleteIcon } from "@epam/assets/icons/common/action-deleteforever-18.svg";

interface ITubButtonDropdownProps extends Omit<IPresetsApi, 'presets'> {
    preset: ITablePreset;
    addPreset: () => void;
    tableState: DataTableState;
    renamePreset: () => void;
}

export const PresetActionsDropdown = (props: ITubButtonDropdownProps) => {
    const { uuiNotifications } = useUuiContext();

    const copyUrlToClipboard = useCallback(async () => {
        await navigator.clipboard.writeText(location.href);
        successNotificationHandler('Link copied!');
    }, []);

    const saveInCurrent = useCallback(async (preset: ITablePreset) => {
        const newPreset = {
            ...preset,
            filter: props.tableState.filter,
            columnsConfig: props.tableState.columnsConfig,
        };
        await props.updatePreset(newPreset);
        successNotificationHandler('Changes saved!');
    }, [props.tableState.filter, props.tableState.columnsConfig]);

    const successNotificationHandler = useCallback((text: string) => {
        uuiNotifications.show((props) => (
            <SuccessNotification { ...props } >
                <Text size="36" font="sans" fontSize="14">{ text }</Text>
            </SuccessNotification>
        ), { position: 'top-right', duration: 3 }).catch(() => null);
    }, []);

    const saveInCurrentHandler = useCallback(() => {
        saveInCurrent(props.preset);
    }, [props.preset]);

    const discardAllChangesHandler = useCallback(() => {
        props.choosePreset(props.preset);
    }, [props.preset]);

    const duplicateHandler = useCallback(() => {
        props.duplicatePreset(props.preset);
    }, [props.preset]);

    const deleteHandler = useCallback(async () => {
        await props.deletePreset(props.preset);
        if (props.activePresetId && props.activePresetId === props.preset.id) {
            props.resetToDefault();
        }
    }, [props.activePresetId, props.deletePreset, props.resetToDefault, props.preset]);

    const renderBody = () => {
        return (
            <Panel background="white" shadow={ true } cx={ css.presetDropdownPanel }>
                { (props.activePresetId === props.preset.id && props.hasPresetChanged(props.preset)) &&
                    <>
                        <FlexRow key={ `${ props.preset.id }-save-in-current` }>
                            <DropdownMenuButton icon={ SaveInCurrentIcon } caption="Save in current" onClick={ saveInCurrentHandler }/>
                        </FlexRow>
                        <FlexRow key={ `${ props.preset.id }-save-as-new` }>
                            <DropdownMenuButton icon={ SaveAsNewIcon } caption="Save as new" onClick={ props.addPreset }/>
                        </FlexRow>
                        <FlexRow key={ `${ props.preset.id }-discard` } borderBottom="gray40">
                            <DropdownMenuButton icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ discardAllChangesHandler  }/>
                        </FlexRow>
                    </>
                }
                <FlexRow key={ `${ props.preset.id }-duplicate` }>
                    <DropdownMenuButton icon={ CopyIcon } caption="Duplicate" onClick={ duplicateHandler }/>
                </FlexRow>
                <FlexRow key={ `${ props.preset.id }-rename` }>
                    <DropdownMenuButton icon={ RenameIcon } caption="Rename" onClick={ props.renamePreset }/>
                </FlexRow>
                <FlexRow borderBottom="gray40" key={ `${ props.preset.id }-copyLink` }>
                    <DropdownMenuButton icon={ CopyLinkIcon } caption="Copy Link" onClick={ copyUrlToClipboard }/>
                </FlexRow>
                <FlexRow key={ `${ props.preset.id }-delete` } cx={ css.deleteRow }>
                    <DropdownMenuButton icon={ DeleteIcon } caption="Delete" cx={ css.deleteButton } onClick={ deleteHandler }/>
                </FlexRow>
            </Panel>
        );
    };

    const renderTarget = useCallback((props: IDropdownToggler) => {
        return (
            <IconContainer { ...props } icon={ menuIcon } />
        );
    }, []);

    return (
        <>
            <Dropdown
                renderBody={ renderBody }
                renderTarget={ renderTarget }
                placement="bottom"
            />
        </>
    );
};
