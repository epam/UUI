import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';

import { Dropdown } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui-core";

import { useFocused, useSelected } from 'slate-react';

import {
    getBlockAbove,
    ImageElement,
    setElements,
    PlatePluginComponent,
    PlateRenderElementProps,
    Value,
    TElement,
    PlateEditor,
    findNodePath,
    select,
} from '@udecode/plate';

import { FileUploadResponse } from "@epam/uui-core";

import css from './ImageBlock.scss';
import { ImgToolbar } from './Toolbar';

export type PlateImgAlign = 'left' | 'center' | 'right';
type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
type SlateImageSize = { width: number, height: number | string };

type SlateImageData = {
    imageSize: SlateImageSize;
    align: SlateImgAlign;
} & Partial<(File | FileUploadResponse)>;

interface SlateProps {
    data: SlateImageData;
}

interface PlateProps {
    url: string;
    align: PlateImgAlign;
    width: number;
}

export interface ImageElement extends TElement, PlateProps, SlateProps {}

interface UpdatingProps { width?: number, align?: PlateImgAlign };

const { FlexRow, Spinner } = uuiSkin;

const IMAGE_STYLES = { paddingTop: 0, paddingBottom: 0 };
const MIN_CAPTION_WIDTH = 92;
const MIN_IMG_WIDTH = 12;
const PLATE_TO_SLATE_IMG_ALIGN: { [key in PlateImgAlign]: SlateImgAlign } = {
    'left': 'align-left',
    'right': 'align-right',
    'center': 'align-center',
};

const toSlateAlign = (plateAlign: PlateImgAlign): SlateImgAlign => PLATE_TO_SLATE_IMG_ALIGN[plateAlign];

const getUpdatedElement = (
    element: ImageElement,
    { width = element?.width || 0, align = element.align || 'left' }: UpdatingProps
) => ({
    ...element,
    data: {
        ...(element.data || {}),
        imageSize: {
            width,
            height: '100%'
        },
        align: toSlateAlign(align),
    },
    width,
    height: '100%',
    align
});

const useUpdatingElement = ({ element, editor }: { element: ImageElement, editor: PlateEditor }) => {
    const [align, setAlign] = useState<PlateImgAlign>(element.align || 'left');
    const [width, setWidth] = useState<number | undefined>(element.data?.imageSize.width || 0);

    const onResize = useCallback(() => {}, []);

    const onResizeStop = useCallback((e: any, direction: any, ref: any) => {
        const path = findNodePath(editor, element!);
        if (!path) return;

        const newWidth = ref.offsetWidth;
        if (newWidth !== width) {
            setWidth(newWidth);
            setElements(editor, getUpdatedElement(element, { width: newWidth }));
        } else {
            // select if not resized
            select(editor, path);
        }
    }, [editor, element, width])

    const isInitialized = !!element.data;
    const size = { width, height: '100%' };
    const resizableProps = isInitialized
        ? { minWidth: MIN_IMG_WIDTH, onResize, onResizeStop, size }
        : { minWidth: 'fit-content', onResize, onResizeStop, size };

    const isCaptionEnabled = isInitialized && width >= MIN_CAPTION_WIDTH;
    const caption = isCaptionEnabled ? { disabled: false } : { disabled: true };

    return { align, setAlign, resizableProps, caption, style: IMAGE_STYLES };
}

export const Image: PlatePluginComponent<PlateRenderElementProps<Value, ImageElement>> = (props) => {
    const { editor, element, children } = props;
    const ref = useRef(null);

    const { align, setAlign, ...imageSizeProps } = useUpdatingElement({ element, editor });

    const isFocused = useFocused();
    const isSelected = useSelected();

    const toggleBlockAlignment = (align: PlateImgAlign) => {
        setAlign(align);
        setElements(editor, getUpdatedElement(element, { align }));
    }

    const setMaxWidth = () => {
        const newWidth = ref?.current?.clientWidth;
        if (newWidth) {
            setElements(editor, getUpdatedElement(element, { width: newWidth }));
        }
    };

    const isFullWidth = () => {
        const clientWidth = ref?.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    };

    if (element.type === 'loader') {
        return (
            <>
                <Spinner  { ...props } cx={ css.spinner } />
                { children }
            </>
        );
    }

    const block = getBlockAbove(editor);

    return (
        <Dropdown
            renderTarget={ (innerProps: any) => (
                <div ref={ innerProps.ref } className={ cx(css.wrapper) }>
                    <div
                        ref={ ref }
                        className={ cx(css.slateImage) }>
                        <ImageElement
                            { ...props }
                            { ...imageSizeProps }
                            align={ align }
                        />
                    </div>
                </div>
            ) }
            renderBody={ () => <FlexRow cx={ css.imageToolbarWrapper }>
                <ImgToolbar editor={ editor }
                    align={ align }
                    element={ element }
                    toggleBlockAlignment={ toggleBlockAlignment }
                    isFullWidth={ isFullWidth }
                    setMaxWidth={ setMaxWidth }
                />
            </FlexRow> }
            value={ isSelected && isFocused && block?.length && block[0].type === 'image' }
            placement='top'
        />
    );
};