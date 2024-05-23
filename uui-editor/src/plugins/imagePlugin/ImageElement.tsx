import React, { useMemo, useRef } from 'react';
import {
    PlateElement,
    PlateElementProps,
    Value,
    withHOC,
} from '@udecode/plate-common';
import { Image } from '@udecode/plate-media';
import {
    useFocused, useReadOnly, useSelected,
} from 'slate-react';
import cx from 'classnames';
import css from './ImageElement.module.scss';
import { Resizable, ResizeHandle } from '../../implementation/Resizable';
import { PlateImgAlign, TImageElement } from './types';
import { Caption, CaptionTextarea } from '@udecode/plate-caption';
import { ResizableProvider } from '@udecode/plate-resizable';

interface ImageElementProps extends PlateElementProps<Value, TImageElement> {
    align?: PlateImgAlign;
}

const MIN_IMG_WIDTH = 12;
const MIN_CAPTION_WIDTH = 92;

export const ImageElement = withHOC(ResizableProvider, ({
    className,
    align,
    ...props
}: ImageElementProps) => {
    const { children, nodeProps } = props;

    const focused = useFocused();
    const selected = useSelected();
    const readOnly = useReadOnly();

    const imageRef = useRef<HTMLImageElement>();

    const isCaptionEnabled = useMemo(() => {
        const imageWidth = imageRef.current?.width;
        return typeof imageWidth === 'number' && imageWidth >= MIN_CAPTION_WIDTH;
    }, []);

    const aligns = [
        align === 'center' && css.alignCenter,
        align === 'left' && css.alignLeft,
        align === 'right' && css.alignRight,
    ];

    const visible = focused && selected;

    const resizeHandleClasses = [
        css.resizeHandleOpacity,
        visible && css.resizeHandleVisible, // for mobile
    ];

    return (
        <PlateElement className={ cx(className) } { ...props }>
            <figure className={ cx(css.group) } contentEditable={ false }>
                <Resizable
                    align={ align }
                    options={ {
                        align,
                        readOnly,
                        minWidth: MIN_IMG_WIDTH,
                    } }
                >
                    {!readOnly && (
                        <ResizeHandle
                            options={ { direction: 'left' } }
                            className={ cx(resizeHandleClasses) }
                        />
                    )}
                    <Image
                        { ...nodeProps }
                        className={ cx(
                            css.image,
                            visible && css.selectedImage, // for mobile
                            nodeProps?.className,
                        ) }
                        ref={ imageRef }
                    />
                    {!readOnly && (
                        <ResizeHandle
                            options={ { direction: 'right' } }
                            className={ cx(resizeHandleClasses) }
                        />
                    )}
                </Resizable>

                {isCaptionEnabled && (
                    <Caption style={ { width: imageRef.current?.width } } className={ cx(css.imageCaption, ...aligns) }>
                        <CaptionTextarea
                            className={ cx(css.caption) }
                            placeholder="Write a caption..."
                            readOnly={ readOnly }
                        />
                    </Caption>
                )}
            </figure>

            {children}
        </PlateElement>
    );
});
