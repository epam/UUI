import { TElement } from '@udecode/plate-common';

export type PlateImgAlign = 'left' | 'center' | 'right';
export type ImageSize = { width?: number, height?: number | string };

export type ModalPayload = string | File[];

export interface TImageElement extends TElement {
    url: string;
    width?: number;
    align?: PlateImgAlign;
    data?: {
        size?: ImageSize;
        [key: string]: unknown;
    }
}
