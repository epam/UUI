import * as types from "../types";
import { withMods } from "@epam/uui-core";
import { NumericInput as uuiNumericInput, NumericInputProps as uuiNumericInputProps } from "@epam/uui-components";
import { EditMode, IHasEditMode } from "../types";
import { systemIcons } from "../../icons/icons";
import textInputCss from "./TextInput.scss";
import css from "./NumericInput.scss";

const defaultSize = "36";
const defaultMode = EditMode.FORM;

export interface NumericInputMods extends types.SizeMod, IHasEditMode {}

export function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        css["size-" + (mods.size || defaultSize)],
        textInputCss["size-" + (mods.size || defaultSize)],
        textInputCss["mode-" + (mods.mode || defaultMode)],
    ];
}

export type NumericInputProps = uuiNumericInputProps & NumericInputMods;

export const NumericInput = withMods<uuiNumericInputProps, NumericInputMods>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => ({
        upIcon: systemIcons[props.size || defaultSize].foldingArrow,
        downIcon: systemIcons[props.size || defaultSize].foldingArrow,
        align: props.align ?? (props.mode === "cell" ? "right" : "left"),
        disableArrows: props.disableArrows ?? props.mode === "cell",
    }),
);
