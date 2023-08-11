import { Value } from '@udecode/plate-common';
import { TElement } from '@udecode/plate-common';
import { FileUploadResponse } from '@epam/uui-core';

export type EditorValue = Value | null;

export const IFRAME_PLUGIN_KEY = 'iframe';
export const IFRAME_PLUGIN_TYPE = 'iframe';

export const IMAGE_PLUGIN_KEY = 'image';
export const IMAGE_PLUGIN_TYPE = 'image';

export type PlateImgAlign = 'left' | 'center' | 'right';
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
export type SlateImageSize = { width: number, height: number | string };

type SlateImageData = {
    imageSize: SlateImageSize;
    align: SlateImgAlign;
} & Partial<(File | FileUploadResponse)>;

export interface SlateProps {
    data: SlateImageData;
}

export interface PlateProps {
    url: string;
    align?: PlateImgAlign;
    width?: number;
}

export interface IImageElement extends TElement, PlateProps, SlateProps {}
