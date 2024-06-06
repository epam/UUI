import React, {
    Fragment, useEffect, useRef, useState,
} from 'react';
import cx from 'classnames';
import {
    PlateRenderElementProps,
    Value,
    getBlockAbove,
    setElements,
    PlatePluginComponent,
} from '@udecode/plate-common';
import { useFocused, useSelected } from 'slate-react';
import {
    Dropdown, FlexRow, Spinner,
} from '@epam/uui';
import { ImageElement } from './ImageElement';

import css from './ImageBlock.module.scss';
import { ImgToolbar } from './Toolbar';
import { PlateImgAlign, TImageElement } from './types';
import { useMediaState } from '@udecode/plate-media';
import { IMAGE_TYPE } from './constants';

const IMAGE_STYLES = {
    paddingTop: 0,
    paddingBottom: 0,
};

export const Image: PlatePluginComponent<PlateRenderElementProps<Value, TImageElement>> = function ImageComp(props) {
    const {
        editor, element, children,
    } = props;
    const ref = useRef<HTMLDivElement>(null);
    const isFocused = useFocused();
    const isSelected = useSelected();

    const { align } = useMediaState();
    const [showToolbar, setShowToolbar] = useState(false);

    // toolbar
    useEffect(() => {
        const block = getBlockAbove(editor);
        setShowToolbar(
            isSelected
            && isFocused
            && !!block?.length
            && block[0].type === IMAGE_TYPE,
        );
    }, [isSelected, isFocused, editor]);

    // align
    const toggleBlockAlignment = (toggleAlign: PlateImgAlign) => {
        setElements(editor, { align: toggleAlign });
    };

    // width
    const setMaxWidth = () => {
        const newWidth = ref.current?.clientWidth;
        if (newWidth) {
            setElements(editor, { width: newWidth });
        }
    };

    const isFullWidth = () => {
        const clientWidth = ref.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    };

    if (element.type === 'loader') {
        return (
            <Fragment>
                <Spinner { ...props } cx={ css.spinner } />
                { children }
            </Fragment>
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
            onValueChange={ (value) => () => {
                setShowToolbar(value);
            } }
            value={ showToolbar }
            placement="top"
        />
    );
};
