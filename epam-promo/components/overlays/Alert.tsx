import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

interface AlertMods {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: EpamPrimaryColor | uui.AlertProps['color'];
}

/** Represents the properties of an Alert component. */
export interface AlertProps extends uui.AlertCoreProps, AlertMods {}

export const Alert = /* @__PURE__ */createSkinComponent<uui.AlertProps, AlertProps>(
    uui.Alert,
    (props) => ({
        ...props,
        color: props.color ?? 'blue',
    }),
);
