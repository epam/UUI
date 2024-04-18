import { FileUploadResponse } from '@epam/uui-core';
import { TElement } from '@udecode/plate-common';

export type PlateImgAlign = 'left' | 'center' | 'right';
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
export type SlateImageSize = { width: number, height: number | string };

type SlateImageData = {
    imageSize: SlateImageSize;
    align: SlateImgAlign;
} & Partial<(File | FileUploadResponse)>;

export interface SlateImageProps {
    data: SlateImageData;
}

interface PlateProps {
    url: string;
    align?: PlateImgAlign;
    width?: number;
}

export interface IImageElement extends TElement, PlateProps, SlateImageProps {}
