import { Dropdown } from '@epam/uui';
import { findNode, toDOMNode, useEditorState, useEventEditorSelectors } from '@udecode/plate-common';
import { getCellTypes } from '@udecode/plate-table';
import cx from 'classnames';
import React, { useRef } from 'react';
import { Range } from 'slate';
import { offset } from '@floating-ui/react';

import { isImageSelected, isTextSelected, SelectionUtils } from '../helpers';
import css from './PositionedToolbar.module.scss';

interface ToolbarProps {
    editor: any;
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left';
}

export function FloatingToolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>(undefined);
    const editor = useEditorState(); // TODO: use useEditorRef
    const inFocus = useEventEditorSelectors.focus() === editor.id;

    const virtualReferenceElement = {
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
    };

    let isToolbarVisible: boolean;
    if (props.isImage) {
        isToolbarVisible = isImageSelected(editor);
    } else {
        isToolbarVisible = !!props.isTable || isTextSelected(editor, inFocus);
    }

    return isToolbarVisible && (
        <Dropdown
            value={ isToolbarVisible }
            virtualTarget={ virtualReferenceElement }
            renderTarget={ (p) => <div { ...p }></div> }
            placement={ props.placement || 'top' }
            middleware={ [
                offset(12),
            ] }
            renderBody={ (bodyProps) => (
                <div
                    role="toolbar"
                    tabIndex={ 0 }
                    aria-label="Formatting toolbar"
                    onMouseDown={ (e) => e.preventDefault() }
                    onKeyDown={ (e) => {
                        if (e.key === 'Escape' && bodyProps.onClose) {
                            bodyProps.onClose();
                        }
                    } }
                    className={ cx(css.container, 'slate-prevent-blur') }
                >
                    {props.children}
                </div>
            ) }
        />
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
