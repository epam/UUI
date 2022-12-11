import * as types from "../types";
import css from "./NumericInput.scss";
import textInputCss from "./TextInput.scss";
import { withMods } from "@epam/uui-core";
import { NumericInput as uuiNumericInput, NumericInputProps } from "@epam/uui-components";
import { systemIcons } from "../../icons/icons";
import { EditMode, IHasEditMode } from "../types";

const defaultSize = "36";
const defaultMode = EditMode.FORM;

export interface NumericInputMods extends types.SizeMod, IHasEditMode {
}

export function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        css["size-" + (mods.size || defaultSize)],
        textInputCss["size-" + (mods.size || defaultSize)],
        textInputCss["mode-" + (mods.mode || defaultMode)],
    ];
}

export const NumericInput = withMods<NumericInputProps, NumericInputMods>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => ({
        upIcon: systemIcons[props.size || defaultSize].foldingArrow,
        downIcon: systemIcons[props.size || defaultSize].foldingArrow,
        align: props.align ?? (props.mode === "cell" ? "right" : "left"),
        disableArrows: props.disableArrows ?? props.mode === "cell",
    }),
);
