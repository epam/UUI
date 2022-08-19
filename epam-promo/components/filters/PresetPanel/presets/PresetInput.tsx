import React, { useCallback, useState } from "react";
import css from "./PresetInput.scss";
import { TextInput } from "../../../inputs";
import { FlexCell } from "../../../layout";
import { ITablePreset } from "@epam/uui-core";

export const enum InputActionType {
    SAVE_NEW = "SAVE_NEW",
    RENAME = "RENAME",
}

interface IPresetInputProps {
    onCancel: () => void;
    actionType: InputActionType;
    createNewAction?: (name: string) => void;
    renameAction?: (preset: ITablePreset) => void;
    renamedPreset?: ITablePreset;
}

export const PresetInput = (props: IPresetInputProps) => {
    const [presetCaption, setPresetCaption] = useState(props.actionType === InputActionType.SAVE_NEW ? "" : props?.renamedPreset.name);

    const cancelActionHandler = useCallback(() => {
        setPresetCaption('');
        props.onCancel();
    }, [props.onCancel]);

    const acceptActionHandler = useCallback(() => {
        switch (props.actionType) {
            case InputActionType.SAVE_NEW: {
                if (!presetCaption) {
                    props.onCancel();
                    return;
                }
                props?.createNewAction(presetCaption);
                props.onCancel();
                setPresetCaption("");
                break;
            }
            case InputActionType.RENAME: {
                if (props?.renamedPreset) {
                    const newPreset: ITablePreset = {
                        ...props.renamedPreset,
                        name: presetCaption,
                    };
                    props?.renameAction(newPreset);
                    props.onCancel();
                    setPresetCaption("");
                }
                break;
            }
        }
    }, [props, presetCaption]);

    const newPresetOnBlurHandler = useCallback(() => {
        if (presetCaption.length) {
            return;
        }
        props.onCancel();
    }, [presetCaption.length, props.onCancel]);

    return (
        <FlexCell cx={ css.presetInputCell } minWidth={ 180 }>
            <TextInput
                cx={ css.presetInput }
                onValueChange={ setPresetCaption }
                value={ presetCaption }
                onCancel={ cancelActionHandler }
                onAccept={ acceptActionHandler }
                onBlur={ newPresetOnBlurHandler }
                autoFocus
            />
        </FlexCell>
    );
};
