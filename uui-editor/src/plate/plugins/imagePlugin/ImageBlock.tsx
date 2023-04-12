import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import { Dropdown } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui-core";

import { useFocused, useSelected } from 'slate-react';

import {
    getBlockAbove,
    ImageElement,
    setElements,
    ToolbarButton as PlateToolbarButton,
    PlatePluginComponent,
    PlateRenderElementProps,
    Value,
    TElement,
    useResizableStore,
    PlateEditor,
    findNodePath,
    select,
    setNodes,
    TResizableElement,
} from '@udecode/plate';
import { debounce } from 'lodash';

import { FileUploadResponse } from "@epam/uui-core";

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as AlignLeft } from '../../../icons/align-left.svg';
import { ReactComponent as AlignCenter } from '../../../icons/align-center.svg';
import { ReactComponent as AlignRight } from '../../../icons/align-right.svg';
import { ReactComponent as FullWidth } from '../../../icons/align-full-width.svg';

import css from './ImageBlock.scss';

const { FlexRow, Spinner } = uuiSkin;

const IMAGE_STYLES = { paddingTop: 0, paddingBottom: 0 };
const MIN_CAPTION_WIDTH = 92;

type ImageSize = { width: number, height: number | string };

type ImageData = {
    imageSize?: ImageSize;
} & Partial<(File | FileUploadResponse)>;

type Align = 'left' | 'center' | 'right';

export interface ImageElement extends TElement {
    url: string;
    align: Align;
    data?: ImageData;
}

const updateImageSize = debounce((editor: PlateEditor, element: ImageElement, width: number) => {
    const path = findNodePath(editor, element!);
    if (!path) return;

    setNodes<TResizableElement>(
        editor,
        { ...(element.data || {}), data: { imageSize: { width, height: '100%' } } },
        { at: path }
    );
}, 100, { leading: false, trailing: true });

/**
 * Controls image size
 */
const useImgSizeProps = ({ element, editor }: { element: ImageElement, editor: PlateEditor }) => {
    const [width] = useResizableStore().use.width();

    // 100% is default plate img width if element.width is not defined
    const isDefinedWidth = !!width && width !== '100%';

    const resizableProps = isDefinedWidth
        ? { minWidth: 12 } // resized
        : { size: { width: 0, height: '100%' }, minWidth: 'fit-content' } // new image

    const updateSize = useCallback((newWidth: number) => updateImageSize(editor, element, newWidth), [editor, element])

    /**
     * Updates @deprecated element.data.imageSize property.
     * element.width updates internally by plate.
    */
    useEffect(() => {
        if (element.data?.imageSize?.width !== width && isDefinedWidth) {
            updateSize(width);
        }
    }, [width, isDefinedWidth]);

    const isCaptionEnabled = isDefinedWidth && width >= MIN_CAPTION_WIDTH;
    const caption = isCaptionEnabled ? { disabled: false } : { disabled: true };

    return { style: IMAGE_STYLES, resizableProps, caption };
}

export const Image: PlatePluginComponent<PlateRenderElementProps<Value, ImageElement>> = (props) => {
    const { editor, element, children } = props;
    const ref = useRef(null);

    const [align, setAlign] = useState<Align>(element.align || 'left');
    const imageSizeProps = useImgSizeProps({ element, editor })

    const isFocused = useFocused();
    const isSelected = useSelected();

    if (element.type === 'loader') {
        return (
            <>
                <Spinner  { ...props } cx={ css.spinner } />
                { children }
            </>
        );
    }

    const toggleBlockAlignment = (align: Align) => {
        setAlign(align);
        setElements(editor, {
            ...element,
            align,
        });
    }

    const setMaxWidth = () => {
        if (ref?.current?.clientWidth) {
            setElements(editor, {
                ...element,
                width: ref?.current?.clientWidth,
            });
        }
    };

    const isFullWidth = () => {
        const clientWidth = ref?.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    };

    const renderToolbar = useCallback(() => {
        return (
            <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'left' }
                        icon={ AlignLeft }
                        onClick={ () => toggleBlockAlignment('left') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'center' }
                        icon={ AlignCenter }
                        onClick={ () => toggleBlockAlignment('center') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'right' }
                        icon={ AlignRight }
                        onClick={ () => toggleBlockAlignment('right') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ isFullWidth() }
                        icon={ FullWidth }
                        onClick={ setMaxWidth }
                    /> }
                />
            </div>
        );
    }, [element, toggleBlockAlignment, isFullWidth, setMaxWidth]);

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
            renderBody={ () => <FlexRow cx={ css.imageToolbarWrapper }>{ renderToolbar() }</FlexRow> }
            value={ isSelected && isFocused && block?.length && block[0].type === 'image' }
            placement='top'
        />
    );
};