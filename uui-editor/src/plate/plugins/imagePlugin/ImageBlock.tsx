import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    useResizableStore,
    PlateEditor,
    findNodePath,
} from '@udecode/plate';
import { debounce } from 'lodash';

import { FileUploadResponse } from "@epam/uui-core";

import css from './ImageBlock.scss';
import { ImgToolbar } from './Toolbar';

const { FlexRow, Spinner } = uuiSkin;

const IMAGE_STYLES = { paddingTop: 0, paddingBottom: 0 };
const MIN_CAPTION_WIDTH = 92;

export type PlateImgAlign = 'left' | 'center' | 'right';
type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';
type SlateImageSize = { width: number, height: number | string };

const PLATE_TO_SLATE_IMG_ALIGN: { [key in PlateImgAlign]: SlateImgAlign } = {
    'left': 'align-left',
    'right': 'align-right',
    'center': 'align-center',
};

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

const toSlateAlign = (plateAlign: PlateImgAlign): SlateImgAlign => {
    return PLATE_TO_SLATE_IMG_ALIGN[plateAlign];
}

const toPlateProps = (prevProps: PlateProps,
    {
        width = prevProps.width,
        align = prevProps.align
    }: { width?: number, align?: PlateImgAlign }
) => {
    return { width, align };
}

const toSlateProps = (
    prevData: SlateImageData,
    {
        width = prevData?.imageSize?.width,
        align = prevData?.align
    }: { width?: number, align?: SlateImgAlign }
): SlateProps => {
    return { data: { ...prevData, imageSize: { width, height: '100%' }, align } };
}

type UpdateFunction = (element: ImageElement, { width, align }: { width?: number, align?: PlateImgAlign }) => void;

const getImgElementPropsMapper = (editor: PlateEditor) => {
    const update: UpdateFunction = (element, { width, align }) => {
        setElements(editor, {
            ...element,
            ...toPlateProps(element, { width, align }),
            ...toSlateProps(element.data, { width, align: toSlateAlign(align) })
        });
    }

    return update;
}

const updateImageSize = debounce(
    (update: UpdateFunction, editor: PlateEditor, element: ImageElement, width: number) => {
        const path = findNodePath(editor, element!);
        if (!path) return;

        update(element, { width });
    },
    100,
    { leading: false, trailing: true }
);

/**
 * Controls image size
 */
const useImgSizeProps = ({ element, editor, updateElement }: { element: ImageElement, editor: PlateEditor, updateElement: UpdateFunction }) => {
    const [width] = useResizableStore().use.width();

    // 100% is default plate img width if element.width is not defined
    const isDefinedWidth = !!width && width !== '100%';

    const resizableProps = isDefinedWidth ? { minWidth: 12 } : { minWidth: 'fit-content' };

    // Updates element.data.imageSize property.
    useEffect(() => {
        if (element.data?.imageSize?.width !== width && isDefinedWidth) {
            updateImageSize(updateElement, editor, element, width);
        }
    }, [width, isDefinedWidth]);

    const isCaptionEnabled = isDefinedWidth && width >= MIN_CAPTION_WIDTH;
    const caption = isCaptionEnabled ? { disabled: false } : { disabled: true };

    return { style: IMAGE_STYLES, resizableProps, caption };
}

export const Image: PlatePluginComponent<PlateRenderElementProps<Value, ImageElement>> = (props) => {
    const { editor, element, children } = props;
    const ref = useRef(null);
    const isNotInitialized = !element.data;

    const updateElement = useMemo(() => getImgElementPropsMapper(editor), [editor, element]);

    // set initial slate props for new image
    useEffect(() => {
        if (isNotInitialized && element.type === 'image') {
            updateElement(element, { width: 0, align: 'left' });
        }
    }, []);

    const [align, setAlign] = useState<PlateImgAlign>(element.align || 'left');
    const imageSizeProps = useImgSizeProps({ element, editor, updateElement });

    const isFocused = useFocused();
    const isSelected = useSelected();

    const toggleBlockAlignment = (align: PlateImgAlign) => {
        setAlign(align);
        updateElement(element, { align });
    }

    const setMaxWidth = () => {
        const newWidth = ref?.current?.clientWidth;
        if (newWidth) {
            updateElement(element, { width: newWidth });
        }
    };

    const isFullWidth = () => {
        const clientWidth = ref?.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    };

    if (element.type === 'loader' || isNotInitialized) {
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
                            align={ align }
                            { ...imageSizeProps }
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