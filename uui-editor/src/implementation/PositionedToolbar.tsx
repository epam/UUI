import { Portal } from '@epam/uui-components';
import { findNode, isEditorFocused, toDOMNode, usePlateEditorState } from '@udecode/plate-common';
import { getSelectionBoundingClientRect } from '@udecode/plate-floating';
import { getCellTypes } from '@udecode/plate-table';
import cx from "classnames";
import React, { useRef } from 'react';
import * as PopperJS from 'react-popper';
import { Range } from 'slate';

import { isImageSelected, isTextSelected } from '../helpers';
import css from './Toolbar.module.scss';

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

            return getSelectionBoundingClientRect() as DOMRect;
        },
    });

    return (
        <Portal>
            { (props.isImage ? isImageSelected(editor) : props.isTable || isTextSelected(editor, inFocus)) && (
                <PopperJS.Popper
                    referenceElement={ virtualReferenceElement() }
                    placement={ props.placement || 'top' }
                    modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                >
                    { popperProps => (
                        <div
                            onMouseDown={ e => e.preventDefault() }
                            className={ cx(css.container, 'slate-prevent-blur') }
                            style={ { ...popperProps.style, zIndex: 50 } }
                            ref={ node => {
                                ref.current = node;
                                (popperProps.ref as React.RefCallback<HTMLDivElement>)(node);
                            } }
                        >
                            { props.children }
                        </div>
                    ) }
                </PopperJS.Popper>
            ) }
        </Portal>
    );
}
