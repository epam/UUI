import { withMods } from '@epam/uui-core';
import { ModalWindow as UuiModalWindow, ModalWindowProps as UuiModalWindowProps } from '@epam/uui';

interface ModalWindowMods {
    width?: '300' | '420' | '600' | '900' | number;
    height?: '300' | '700' | 'auto' | number;
}

export const ModalWindow = withMods<Omit<UuiModalWindowProps, 'width' | 'height'>, ModalWindowMods>(
    UuiModalWindow,
    () => [],
    (props) => ({
        ...props,
        width: props.width && Number(props.width),
        height: props.height && props.height !== 'auto' && Number(props.height),
    }),
);
