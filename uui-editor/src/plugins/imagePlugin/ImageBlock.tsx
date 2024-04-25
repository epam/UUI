import React, {
    useCallback, useEffect, useRef, useState,
} from 'react';
import cx from 'classnames';
import {
    PlateEditor, PlateRenderElementProps, Value, findNodePath, getBlockAbove, setElements,
    withHOC,
} from '@udecode/plate-common';
import { useFocused, useSelected } from 'slate-react';
import {
    Dropdown, FlexRow, Spinner,
} from '@epam/uui';
import { ImageElement } from './ImageElement';

import debounce from 'lodash.debounce';
import invert from 'lodash.invert';

import css from './ImageBlock.module.scss';
import { ImgToolbar } from './Toolbar';
import {
    IImageElement, PlateImgAlign, SlateImgAlign,
} from './types';
import { ResizableProvider } from '@udecode/plate-resizable';

interface UpdatingProps { width?: number | string, align?: SlateImgAlign }

const IMAGE_STYLES = {
    paddingTop: 0,
    paddingBottom: 0,
};
const PLATE_TO_SLATE_IMG_ALIGN = {
    left: 'align-left',
    right: 'align-right',
    center: 'align-center',
};
const SLATE_TO_PLATE_IMG_ALIGN = invert(PLATE_TO_SLATE_IMG_ALIGN);

const toSlateAlign = (plateAlign: PlateImgAlign) => PLATE_TO_SLATE_IMG_ALIGN[plateAlign] as SlateImgAlign;

export const toPlateAlign = (slateAlign: SlateImgAlign) => SLATE_TO_PLATE_IMG_ALIGN[slateAlign] as PlateImgAlign;

const getUpdatedElement = (
    element: IImageElement,
    { width = element.data?.imageSize?.width || 0, align = element.data?.align || 'align-left' }: UpdatingProps,
) => ({
    ...element,
    data: {
        ...(element.data || {}),
        imageSize: {
            width,
            height: '100%',
        },
        align,
    },
});

const debounced = debounce((exec: () => void) => exec(), 100, {
    leading: true,
    trailing: false,
});

const isImgElem = (editor?: PlateEditor, element?: IImageElement) => editor && element?.type === 'image';

const useUpdatingElement = ({ element, editor }: { element: IImageElement, editor: PlateEditor }) => {
    const prevNodeWidthRef = useRef(element.width);

    // initialize image width
    if (isImgElem(editor, element) && !element.width) {
        if (element.data?.imageSize) {
            element.width = element.data?.imageSize?.width; // existing
        } else {
            element.width = 'fit-content' as unknown as number; // new image
        }
    }

    useEffect(() =>
        debounced(() => {
            const prevWidth = prevNodeWidthRef.current;
            const path = findNodePath(editor, element!);
            if (isImgElem(editor, element) && !!path && !!element.width && prevWidth !== element.width) {
                setElements(
                    editor,
                    getUpdatedElement(element, { width: element.width }),
                    { at: path },
                );
                prevNodeWidthRef.current = element.width;
            }
        }), [element.width]);
};

export const Image = withHOC(ResizableProvider, (props : PlateRenderElementProps<Value, IImageElement>): JSX.Element => {
    const {
        editor, element, children,
    } = props;
    const ref = useRef<HTMLDivElement>(null);
    const isFocused = useFocused();
    const isSelected = useSelected();

    const [align, setAlign] = useState<PlateImgAlign>(toPlateAlign(element.data?.align) || 'left');
    const [showToolbar, setShowToolbar] = useState(false);

    // controls slate element structure
    useUpdatingElement({
        element,
        editor,
    });

    // toolbar
    useEffect(() => {
        const block = getBlockAbove(editor);
        setShowToolbar(isSelected && isFocused && !!block?.length && block[0].type === 'image');
    }, [isSelected, isFocused]);

    const onChangeDropDownValue = useCallback((value: boolean) => () => {
        setShowToolbar(value);
    }, []);

    // align
    const toggleBlockAlignment = useCallback((toggleAlign: PlateImgAlign) => {
        setAlign(toggleAlign);
        setElements(editor, getUpdatedElement(element, { align: toSlateAlign(toggleAlign) }));
    }, [editor, element]);

    // width
    const setMaxWidth = useCallback(() => {
        const newWidth = ref.current?.clientWidth;
        if (newWidth) {
            element.width = newWidth;
            setElements(editor, getUpdatedElement(element, { width: newWidth }));
        }
    }, [editor, element]);

    const isFullWidth = useCallback(() => {
        const clientWidth = ref.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    }, [element.width]);

    if (element.type === 'loader') {
        return (
            <>
                <Spinner { ...props } cx={ css.spinner } />
                { children }
            </>
        );
    }

    return (
        <Dropdown
            renderTarget={ (innerProps: any) => (
                <div ref={ innerProps.ref } className={ cx(css.wrapper) }>
                    <div
                        ref={ ref }
                        className={ cx(css.slateImage) }
                    >
                        <ImageElement
                            { ...props }
                            align={ align }
                            style={ IMAGE_STYLES }
                        />
                    </div>
                </div>
            ) }
            closeOnClickOutside={ false }
            renderBody={ () => {
                return (
                    <FlexRow cx={ css.imageToolbarWrapper }>
                        <ImgToolbar
                            align={ align }
                            toggleBlockAlignment={ toggleBlockAlignment }
                            isFullWidth={ isFullWidth }
                            setMaxWidth={ setMaxWidth }
                        />
                    </FlexRow>
                );
            } }
            onValueChange={ onChangeDropDownValue }
            value={ showToolbar }
            placement="top"
        />
    );
});
