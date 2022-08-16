import React, { useCallback } from "react";
import css from "../PresetPanel.scss";
import { ITablePreset } from "@epam/uui-core";
import { FlexRow, Panel } from "../../../layout";
import { DropdownMenuButton } from "../../../overlays";
import { ReactComponent as SaveInCurrentIcon } from "@epam/assets/icons/common/action-update-18.svg";
import { ReactComponent as SaveAsNewIcon } from "@epam/assets/icons/common/save-outline-18.svg";
import { ReactComponent as DiscardChangesIcon } from "@epam/assets/icons/common/content-edit_undo-18.svg";
import { ReactComponent as CopyIcon } from "@epam/assets/icons/common/action-copy_content-18.svg";
import { ReactComponent as RenameIcon } from "@epam/assets/icons/common/content-edit-18.svg";
import { ReactComponent as CopyLinkIcon } from "@epam/assets/icons/common/content-link-18.svg";
import { ReactComponent as DeleteIcon } from "@epam/assets/icons/common/action-deleteforever-18.svg";

interface IPresetDropdownBodyProps {
    preset: ITablePreset;
    isActivePreset: ITablePreset;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    saveInCurrent: (preset: ITablePreset) => void;
    addPreset: () => void;
    choosePreset: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    renamePreset: (preset: ITablePreset) => void;
    copyUrlToClipboard: () => void;
    deletePresetHandler: (preset: ITablePreset) => void;
}

export const PresetDropdownBody = (props: IPresetDropdownBodyProps) => {

    const saveInCurrentHandler = useCallback(() => {
        props.saveInCurrent(props.preset);
    }, [props.preset]);

    const discardAllChangesHandler = useCallback(() => {
        props.choosePreset(props.preset);
    }, [props.preset]);

    const duplicateHandler = useCallback(() => {
        props.duplicatePreset(props.preset);
    }, [props.preset]);

    const renameHandler = useCallback(() => {
        props.renamePreset(props.preset);
    }, [props.preset]);

    const deleteHandler = useCallback(() => {
        props.deletePresetHandler(props.preset);
    }, [props.preset]);

    return (
        <Panel background="white" shadow={ true } cx={ css.presetDropdownPanel }>
            { (props.isActivePreset?.id === props.preset.id && props.hasPresetChanged(props.preset)) &&
                <>
                    <FlexRow key={ `${ props.preset.id }-save-in-current` }>
                        <DropdownMenuButton icon={ SaveInCurrentIcon } caption="Save in current" onClick={ saveInCurrentHandler }/>
                    </FlexRow>
                    <FlexRow key={ `${ props.preset.id }-save-as-new` }>
                        <DropdownMenuButton icon={ SaveAsNewIcon } caption="Save as new" onClick={ props.addPreset }/>
                    </FlexRow>
                    <FlexRow key={ `${ props.preset.id }-discard` } borderBottom="gray40">
                        <DropdownMenuButton icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ discardAllChangesHandler }/>
                    </FlexRow>
                </>
            }
            <FlexRow key={ `${ props.preset.id }-duplicate` }>
                <DropdownMenuButton icon={ CopyIcon } caption="Duplicate" onClick={ duplicateHandler }/>
            </FlexRow>
            <FlexRow key={ `${ props.preset.id }-rename` }>
                <DropdownMenuButton icon={ RenameIcon } caption="Rename" onClick={ renameHandler }/>
            </FlexRow>
            <FlexRow borderBottom="gray40" key={ `${ props.preset.id }-copyLink` }>
                <DropdownMenuButton icon={ CopyLinkIcon } caption="Copy Link" onClick={ props.copyUrlToClipboard }/>
            </FlexRow>
            <FlexRow key={ `${ props.preset.id }-delete` } cx={ css.deleteRow }>
                <DropdownMenuButton icon={ DeleteIcon } caption="Delete" cx={ css.deleteButton } onClick={ deleteHandler }/>
            </FlexRow>
        </Panel>
    );
};