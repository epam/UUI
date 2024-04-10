import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface ModalWindowMods {
    /**
     * Defines component width
     */
    width?: '300' | '420' | '600' | '900' | number;
    /**
     * Defines component height
     */
    height?: '300' | '700' | 'auto' | number;
}

/** Represents the properties of a ModalWindow component. */
export interface ModalWindowProps extends uui.ModalWindowCoreProps, ModalWindowMods {}

export const ModalWindow = /* @__PURE__ */createSkinComponent<uui.ModalWindowProps, ModalWindowProps>(
    uui.ModalWindow,
    (props) => ({
        ...props,
        width: props.width && Number(props.width),
        height: props.height && props.height !== 'auto' && Number(props.height),
    }),
);
