import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface ModalWindowMods {
    /** ModalWindow width */
    width?: '300' | '420' | '480' | '600' | '900' | number;
    /** ModalWindow height */
    height?: '300' | '700' | 'auto' | number;
}

export type ModalWindowProps = uui.ModalWindowCoreProps & ModalWindowMods;

export const ModalWindow = createSkinComponent<uui.ModalWindowProps, ModalWindowProps>(
    uui.ModalWindow,
    (props) => ({
        ...props,
        width: props.width && Number(props.width),
        height: props.height && props.height !== 'auto' && Number(props.height),
    }),
);
