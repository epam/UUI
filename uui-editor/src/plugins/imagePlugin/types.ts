import { TElement } from '@udecode/plate-common';

export type PlateImgAlign = 'left' | 'center' | 'right' | undefined;
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
export type SlateImageSize = { width: number, height: number | string };

interface PlateProps {
    url: string;
    align?: PlateImgAlign;
    width?: number;
}

export type ModalPayload = string | File[];

export interface IImageElement extends TElement, PlateProps {}
