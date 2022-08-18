import React from "react";
import css from "./PresetInput.scss";
import { TextInput } from "../../../inputs";
import { FlexCell } from "../../../layout";

interface IPresetInputProps {
    onValueChange: React.Dispatch<React.SetStateAction<string>>;
    value: string;
    onAccept: () => void;
    onCancel: () => void;
    onBlur: () => void;
}

export const PresetInput = (props: IPresetInputProps) => (
    <FlexCell cx={ css.presetInputCell } minWidth={ 180 }>
        <TextInput
            cx={ css.presetInput }
            onValueChange={ props.onValueChange }
            value={ props.value }
            onCancel={ props.onCancel }
            onAccept={ props.onAccept }
            onBlur={ props.onBlur }
            autoFocus
        />
    </FlexCell>
);
