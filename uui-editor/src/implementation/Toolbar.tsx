import React, { useEffect, useRef, useState } from 'react';
import { Popper } from 'react-popper';
import { usePlateEditorState, isEditorFocused, getDefaultBoundingClientRect, ClientRectObject, PlateEditor, Rect } from '@udecode/plate';
import { Portal } from '@epam/uui-components';
import cx from "classnames";

import { isImageSelected, isTextSelected } from '../helpers';
import css from './Toolbar.scss';
import { VirtualElement } from '@popperjs/core/lib/popper';

interface ToolbarProps {
    editor: any;
    plugins?: any;
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left' | 'auto';
}

export const getSelectionBoundingClientRect = (editor: PlateEditor): ClientRectObject => {
    const domSelection = window.getSelection();

    if (!domSelection || domSelection.rangeCount < 1) {
        return getDefaultBoundingClientRect();
    }

    const domRange = domSelection.getRangeAt(0);

    const clientRect = domRange.getBoundingClientRect();
    if(clientRect.bottom === 0 && clientRect.right === 0) {
        return domSelection.anchorNode.parentElement.getBoundingClientRect();
    }

    return clientRect;
};


export function Toolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>();
    const editor = usePlateEditorState();
    const inFocus = isEditorFocused(editor);

    const virtualReferenceElement = (): VirtualElement => {
        return {
            getBoundingClientRect(): any {
                return getSelectionBoundingClientRect(editor);
            },
        };
    };

    return (
        <Portal>
            { (props.isImage ? isImageSelected(editor) : props.isTable || isTextSelected(editor, inFocus)) && (
                <Popper
                    referenceElement={ virtualReferenceElement() }
                    placement={ props.placement || 'top' }
                    modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                >
                    { popperProps => (
                        <div
                            onMouseDown={ e => e.preventDefault() }
                            className={ cx(css.container, 'slate-prevent-blur') }
                            style={ { ...popperProps.style, zIndex: 30 } }
                            ref={ node => {
                                ref.current = node;
                                (popperProps.ref as React.RefCallback<HTMLDivElement>)(node);
                            } }
                        >
                            { props.children }
                        </div>
                    ) }
                </Popper>
            ) }
        </Portal>
    );
}
