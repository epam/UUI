// @ts-nocheck TODO: remove that
import React from 'react';
import { Box } from '@udecode/plate-common';
import { ElementPopover } from '@udecode/plate-floating';
import { Caption, ELEMENT_IMAGE, Image, Media } from '@udecode/plate-media';
import { useFocused, useReadOnly, useSelected } from 'slate-react';
import {
    HTMLPropsAs,
    ImageElementProps,
    PlateFloatingMedia,
    PlateRenderElementProps,
    TMediaElement,
    Value,
    createComponentAs,
    createElementAs,
    getImageElementStyles,
    mediaFloatingOptions,
    useElementProps,
} from '@udecode/plate';

// TODO: improve usage with babel?
import styled from 'styled-components/macro';

/**
 * The only difference with original plate implementation is we skip useMedia.
 * Since it leads to bugs with pasting images inside the text from word
 */
export const MediaRoot = createComponentAs<
    PlateRenderElementProps<Value, TMediaElement> & HTMLPropsAs<'div'>
>((props) => {
    const htmlProps = useElementProps(props as any);

    return createElementAs('div', htmlProps);
});

export const ImageElement = (props: ImageElementProps) => {
    const {
        children,
        nodeProps,
        caption = {},
        popoverProps = {},
        resizableProps,
        align = 'center',
        ignoreReadOnly = false,
    } = props;

    const { as, ...rootProps } = props;

    const focused = useFocused();
    const selected = useSelected();
    const readOnly = useReadOnly();

    const styles = getImageElementStyles({ ...props, align, focused, selected });

    return (
        <ElementPopover
            content={ <PlateFloatingMedia pluginKey={ ELEMENT_IMAGE } /> }
            floatingOptions={ mediaFloatingOptions }
            { ...popoverProps }
        >
            <MediaRoot { ...rootProps } css={ styles.root.css }>
                <figure
                    css={ styles.figure?.cssx }
                    className={ `group ${ styles.figure?.className }` }
                    contentEditable={ false }
                >
                    <Media.Resizable
                        css={ styles.resizable?.css }
                        className={ styles.resizable?.className }
                        renderHandleLeft={ (htmlProps) => (
                            <Box
                                { ...htmlProps }
                                css={ [styles.handleLeft?.css] }
                                className={ styles.handleLeft?.className }
                            />
                        ) }
                        renderHandleRight={ (htmlProps) => (
                            <Box
                                { ...htmlProps }
                                css={ styles.handleRight?.css }
                                className={ styles.handleRight?.className }
                            />
                        ) }
                        align={ align }
                        readOnly={ !ignoreReadOnly && readOnly }
                        { ...resizableProps }
                    >
                        <Image
                            css={ styles.img?.css }
                            className={ styles.img?.className }
                            { ...nodeProps }
                        />
                    </Media.Resizable>

                    { !caption.disabled && (
                        <Caption.Root
                            css={ styles.figcaption?.css }
                            className={ styles.figcaption?.className }
                        >
                            <Caption.Textarea
                                css={ styles.caption?.css }
                                className={ styles.caption?.className }
                                placeholder={ caption.placeholder ?? 'Write a caption...' }
                                readOnly={ (!ignoreReadOnly && readOnly) || !!caption.readOnly }
                            />
                        </Caption.Root>
                    ) }
                </figure>

                { children }
            </MediaRoot>
        </ElementPopover>
    );
};

