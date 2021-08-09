import { UploadFileToggler as uuiUploadFileToggler, UploadFileTogglerProps } from "@epam/uui-components";
import { withMods } from "uui";
import * as css from './UploadFileToggler.scss';

export function applyUploadFileTogglerMods() {
    return [
        css.root
    ];
}

export const UploadFileToggler = withMods<UploadFileTogglerProps, {}>(
    uuiUploadFileToggler,
    applyUploadFileTogglerMods
);