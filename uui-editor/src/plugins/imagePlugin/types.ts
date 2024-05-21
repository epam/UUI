import { TElement } from '@udecode/plate-common';

export type PlateImgAlign = 'left' | 'center' | 'right';
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
export type SlateImageSize = { width: number, height: number | string };

export type ModalPayload = string | File[];

export interface IImageElement extends TElement {
    url: string;
    width?: number;
    align?: PlateImgAlign;
    data?: {
        src?: string;
        size?: SlateImageSize;
        align?: SlateImgAlign;
        version?: string;
    }
}
