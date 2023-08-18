import { Portal } from '@epam/uui-components';
import { findNode, isEditorFocused, toDOMNode, usePlateEditorState } from '@udecode/plate-common';
import { getCellTypes } from '@udecode/plate-table';
import cx from 'classnames';
import React, { useRef } from 'react';
import { Popper } from 'react-popper';
import { Range } from 'slate';

import { isImageSelected, isTextSelected } from '../helpers';
import css from './Toolbar.module.scss';
import { useLayer } from '@epam/uui-core';

interface ToolbarProps {
    editor: any;
    plugins?: any;
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left' | 'auto';
}

export function PositionedToolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>();
    const editor = usePlateEditorState();
    const inFocus = isEditorFocused(editor);
    const zIndex = useLayer();

    const virtualReferenceElement = (): any => ({
        getBoundingClientRect(): DOMRect {
            if (props.isTable) {
                const [selectedNode] = findNode(editor, {
                    at: Range.start(editor.selection),
                    match: { type: getCellTypes(editor) },
                });

                const domNode = toDOMNode(editor, selectedNode);
                return domNode.getBoundingClientRect();
            }

            return getSelectionBoundingClientRect();
        },
    });

    return (
        <Portal>
            { (props.isImage ? isImageSelected(editor) : props.isTable || isTextSelected(editor, inFocus)) && (
                <Popper
                    referenceElement={ virtualReferenceElement() }
                    placement={ props.placement || 'top' }
                    modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                >
                    { (popperProps) => (
                        <div
                            onMouseDown={ (e) => e.preventDefault() }
                            className={ cx(css.container, 'slate-prevent-blur') }
                            style={ { ...popperProps.style, zIndex } }
                            ref={ (node) => {
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

const getDefaultBoundingClientRect = () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: -9999,
    left: -9999,
    right: 9999,
    bottom: 9999,
}) as DOMRect;

/**
 * Get bounding client rect of the window selection
 */
const getSelectionBoundingClientRect = (): DOMRect => {
    const domSelection = window.getSelection();

    if (!domSelection || domSelection.rangeCount < 1) {
        return getDefaultBoundingClientRect();
    }

    const domRange = domSelection.getRangeAt(0);

    return domRange.getBoundingClientRect();
};
