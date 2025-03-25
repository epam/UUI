import { Portal } from '@epam/uui-components';
import { findNode, toDOMNode, useEditorState, useEventEditorSelectors } from '@udecode/plate-common';
import { getCellTypes } from '@udecode/plate-table';
import cx from 'classnames';
import React, { useRef } from 'react';
import { Popper } from 'react-popper';
import { Range } from 'slate';

import { isImageSelected, isTextSelected, SelectionUtils } from '../helpers';
import css from './PositionedToolbar.module.scss';
import { useLayer } from '@epam/uui-core';

interface ToolbarProps {
    editor: any;
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left' | 'auto';
}

export function FloatingToolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>(undefined);
    const editor = useEditorState(); // TODO: use useEditorRef
    const inFocus = useEventEditorSelectors.focus() === editor.id;
    const zIndex = useLayer()?.zIndex;

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

            const shadowRoot = (() => {
                if (ref.current) {
                    const rootNode = ref.current.getRootNode();
                    const isShadow = rootNode instanceof ShadowRoot;

                    if (isShadow) {
                        return rootNode;
                    }
                }
            })();

            return getSelectionBoundingClientRect({ shadowRoot });
        },
    });

    let isToolbarVisible: boolean;
    if (props.isImage) {
        isToolbarVisible = isImageSelected(editor);
    } else {
        isToolbarVisible = !!props.isTable || isTextSelected(editor, inFocus);
    }

    return (
        <Portal>
            { isToolbarVisible && (
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

const getDefaultBoundingClientRect = () => (({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: -9999,
    left: -9999,
    right: 9999,
    bottom: 9999,
}) as DOMRect);

/**
 * Get bounding client rect of the window selection
 */
const getSelectionBoundingClientRect = (params: { shadowRoot: ShadowRoot | undefined }): DOMRect => {
    const { shadowRoot } = params;
    const selection = SelectionUtils.getSelection({ shadowRoot });

    if (!selection || selection.rangeCount < 1) {
        return getDefaultBoundingClientRect();
    }

    const domRange = SelectionUtils.getSelectionRange0({ selection, shadowRoot });

    return domRange.getBoundingClientRect();
};
