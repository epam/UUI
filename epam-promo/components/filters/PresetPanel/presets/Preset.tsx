import React from "react";
import cx from "classnames";
import css from "../PresetPanel.scss";
import { ITablePreset } from "@epam/uui-core";
import { ControlGroup, FlexCell } from "../../../layout";
import { TextInput } from "../../../inputs";
import { TabButton } from "../../../buttons";
import { TubButtonDropdown } from "./TubButtonDropdown";

interface IPresetProps {
    preset: ITablePreset;
    renamedPreset: ITablePreset | null;
    setRenamedPresetCaption: React.Dispatch<React.SetStateAction<string>>;
    renamedPresetCaption: string;
    cancelRenamePreset: () => void;
    renamePreset: (preset?: ITablePreset) => void;
    isInvalidPresetCaption: boolean;
    renamePresetOnBlurHandler: () => void;
    isActivePreset: ITablePreset;
    choosePreset: (preset: ITablePreset) => void;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    addPreset: () => void;
    copyUrlToClipboard: () => void;
    deletePresetHandler: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    saveInCurrent: (preset: ITablePreset) => void;
}

export const Preset = (props: IPresetProps) => (
    <div key={ props.preset.id } className={ css.presetButtonWrapper }>
        {
            (props.renamedPreset?.id === props.preset.id)
                ?
                <FlexCell cx={ css.renameInputCell } minWidth={ 180 } alignSelf="center">
                    <TextInput
                        cx={ css.renamePreset }
                        onValueChange={ props.setRenamedPresetCaption }
                        value={ props.renamedPresetCaption }
                        onCancel={ props.cancelRenamePreset }
                        onAccept={ props.renamePreset }
                        isInvalid={ props.isInvalidPresetCaption }
                        onBlur={ props.renamePresetOnBlurHandler }
                        autoFocus
                    />
                </FlexCell>
                : <ControlGroup
                    cx={ cx(css.presetControlGroup, {
                        [css.activePresetBorder]: props.isActivePreset?.id === props.preset.id,
                    }) }>
                    <TabButton
                        cx={ css.presetTabButton }
                        caption={ props.preset.name }
                        onClick={ () => props.choosePreset(props.preset) }
                        size="36"
                        withNotify={ props.isActivePreset?.id === props.preset.id && props.hasPresetChanged(props.preset) }
                        icon={ () => <TubButtonDropdown
                            preset={ props.preset }
                            addPreset={ props.addPreset }
                            choosePreset={ props.choosePreset }
                            copyUrlToClipboard={ props.copyUrlToClipboard }
                            deletePresetHandler={ props.deletePresetHandler }
                            duplicatePreset={ props.duplicatePreset }
                            hasPresetChanged={ props.hasPresetChanged }
                            isActivePreset={ props.isActivePreset }
                            renamePreset={ props.renamePreset }
                            saveInCurrent={ props.saveInCurrent }
                        /> }
                        iconPosition="right"
                    />
                </ControlGroup>
        }
    </div>
);
