import { withMods } from '@epam/uui-core';
import { ModalWindow as UuiModalWindow, ModalWindowProps as UuiModalWindowProps } from '@epam/uui';

export interface ModalWindowMods {
    width?: '300' | '420' | '480' | '600' | '900' | number;
    height?: '300' | '700' | 'auto' | number;
}

const getHeight = (height: ModalWindowMods['height']): number | undefined => {
    if (typeof height === 'string') {
        return height === 'auto' ? undefined : Number(height);
    } else return height;
};

export const ModalWindow = withMods<Omit<UuiModalWindowProps, 'width' | 'height'>, ModalWindowMods>(
    UuiModalWindow,
    () => [],
    (props) => ({
        ...props,
        width: props.width && typeof props.width === 'string' ? Number(props.width) : props.width,
        height: props.height && getHeight(props.height),
    }),
);
