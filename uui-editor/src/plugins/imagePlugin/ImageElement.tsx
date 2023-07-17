import React, { useMemo } from 'react';
import {
    Box,
    PlateElement,
    PlateElementProps,
    Value,
} from '@udecode/plate-common';
import {
    Caption,
    CaptionTextarea,
    Image,
    Resizable,
    useMediaState,
    useResizableStore,
} from '@udecode/plate-media';
import { useFocused, useReadOnly, useSelected } from 'slate-react';
import cx from 'classnames';
import css from './ImageElement.module.scss';
import { IImageElement, PlateImgAlign } from './imagePlugin';

interface ImageElementProps extends PlateElementProps<Value, IImageElement> {
    align: PlateImgAlign;
}

const MAX_IMG_WIDTH = 12;
const MIN_CAPTION_WIDTH = 92;

export function ImageElement({
    className,
    align,
    ...props
}: ImageElementProps) {
    const { children, nodeProps } = props;

    const focused = useFocused();
    const selected = useSelected();
    const readOnly = useReadOnly();

    const aligns = [
        align === 'center' && css.alignImageCenter,
        align === 'left' && css.alignImageLeft,
        align === 'right' && css.alignImageRight,
    ]

    const resizeHandleClasses = [
        css.resizeHandleOpacity,
        focused && selected && css.resizeHandleVisible // for mobile
    ]

    useMediaState();

    const [currentWidth] = useResizableStore().use.width();
    const isCaptionEnabled = useMemo(() => {
        let captionEnabled = false;
        if (currentWidth && typeof currentWidth === 'number') {
            captionEnabled = currentWidth >= MIN_CAPTION_WIDTH;
        }

        return captionEnabled;
    }, [currentWidth]);

    return (
        <PlateElement className={ cx(className) } { ...props }>
            <figure className={ cx(css.group) } contentEditable={ false }>
                <Resizable
                    className={ cx(...aligns) }
                    options={ {
                        renderHandleLeft: (htmlProps) => (
                            <Box
                                { ...htmlProps }
                                className={ cx(css.leftHandle, ...resizeHandleClasses) }
                            />
                        ),
                        renderHandleRight: (htmlProps) => (
                            <Box
                                { ...htmlProps }
                                className={ cx(css.rightHandle, ...resizeHandleClasses) }
                            />
                        ),
                        align,
                        readOnly,
                        minWidth: MAX_IMG_WIDTH
                    } }
                >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */ }
                    <Image
                        { ...nodeProps }
                        className={
                            cx(
                                css.image,
                                focused && selected && css.selectedImage, // for mobile
                                nodeProps?.className
                            )
                        }
                    />
                </Resizable>

                { isCaptionEnabled &&
                    <Caption className={ cx(css.imageCaption, ...aligns) }>
                        <CaptionTextarea
                            className={ cx(css.caption) }
                            placeholder="Write a caption..."
                            readOnly={ readOnly }
                        />
                    </Caption>
                }
            </figure>

            { children }
        </PlateElement>
    );
}
