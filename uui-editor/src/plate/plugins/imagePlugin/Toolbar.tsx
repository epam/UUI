import React from "react";
import cx from 'classnames';
import { PlateEditor, ToolbarButton as PlateToolbarButton } from "@udecode/plate";

import { ReactComponent as AlignLeft } from '../../../icons/align-left.svg';
import { ReactComponent as AlignCenter } from '../../../icons/align-center.svg';
import { ReactComponent as AlignRight } from '../../../icons/align-right.svg';
import { ReactComponent as FullWidth } from '../../../icons/align-full-width.svg';

import { ImageElement, PlateImgAlign } from "./ImageBlock";
import { ToolbarButton } from '../../../implementation/ToolbarButton';

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
        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            active={ true }
            onMouseDown={ editor
                ? (e) => e.preventDefault()
                : undefined }
            icon={ <ToolbarButton
                isActive={ align === 'left' }
                icon={ AlignLeft }
                onClick={ () => toggleBlockAlignment('left') } /> } />

        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            active={ true }
            onMouseDown={ editor
                ? (e) => e.preventDefault()
                : undefined }
            icon={ <ToolbarButton
                isActive={ align === 'center' }
                icon={ AlignCenter }
                onClick={ () => toggleBlockAlignment('center') } /> } />

        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            active={ true }
            onMouseDown={ editor
                ? (e) => e.preventDefault()
                : undefined }
            icon={ <ToolbarButton
                isActive={ element.align === 'right' }
                icon={ AlignRight }
                onClick={ () => toggleBlockAlignment('right') } /> } />

        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            active={ true }
            onMouseDown={ editor
                ? (e) => e.preventDefault()
                : undefined }
            icon={ <ToolbarButton
                isActive={ isFullWidth() }
                icon={ FullWidth }
                onClick={ setMaxWidth } /> } />
    </div>
)