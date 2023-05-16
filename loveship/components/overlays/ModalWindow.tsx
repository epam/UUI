import { withMods } from '@epam/uui-core';
import { ModalWindow as UuiModalWindow, ModalWindowProps as UuiModalWindowProps } from '@epam/uui';

const additionalModalWindowWidth = ['300', '420', '480', '600', '900'] as const;
const additionalModalWindowHeight = ['300', '700', 'auto'] as const;

export interface ModalWindowMods {
    width?: typeof additionalModalWindowWidth[number] | number;
    height?: typeof additionalModalWindowHeight[number] | number;
}

const getWidth = (width: ModalWindowMods['width']): number | undefined => {
    if (typeof width === 'string') {
        return additionalModalWindowWidth.includes(width) ? Number(width) : undefined;
    } else return Number(width);
};

const getHeight = (height: ModalWindowMods['height']): number | undefined => {
    if (typeof height === 'string') {
        return additionalModalWindowHeight.includes(height) && height !== 'auto' ? Number(height) : undefined;
    } else return Number(height);
};

export const ModalWindow = withMods<Omit<UuiModalWindowProps, 'width' | 'height'>, ModalWindowMods>(
    UuiModalWindow,
    () => [],
    (props) => ({
        ...props,
        width: props.width && getWidth(props.width),
        height: props.height && getHeight(props.height),
    }),
);
