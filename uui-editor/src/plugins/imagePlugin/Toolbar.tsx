import cx from 'classnames';
import React from "react";

import { ReactComponent as AlignCenter } from '../../icons/align-center.svg';
import { ReactComponent as FullWidth } from '../../icons/align-full-width.svg';
import { ReactComponent as AlignLeft } from '../../icons/align-left.svg';
import { ReactComponent as AlignRight } from '../../icons/align-right.svg';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { ImageElement, PlateImgAlign } from "./ImageBlock";

import { PlateEditor } from "@udecode/plate-common";
import css from './ImageBlock.module.scss';

export const ImgToolbar = ({
    editor,
    align,
    element,
    toggleBlockAlignment,
    isFullWidth,
    setMaxWidth
}: {
    editor: PlateEditor,
    align: PlateImgAlign,
    element: ImageElement,
    toggleBlockAlignment: (align: PlateImgAlign) => void,
    isFullWidth: () => boolean,
    setMaxWidth: () => void,
}) => (
    <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
        <ToolbarButton
            isActive={ align === 'left' }
            icon={ AlignLeft }
            onClick={ () => toggleBlockAlignment('left') } />
        <ToolbarButton
            isActive={ align === 'center' }
            icon={ AlignCenter }
            onClick={ () => toggleBlockAlignment('center') } />
        <ToolbarButton
            isActive={ element.align === 'right' }
            icon={ AlignRight }
            onClick={ () => toggleBlockAlignment('right') } />

        <ToolbarButton
            isActive={ isFullWidth() }
            icon={ FullWidth }
            onClick={ setMaxWidth } />
    </div>
)