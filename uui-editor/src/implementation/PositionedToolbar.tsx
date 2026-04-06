import { Dropdown } from '@epam/uui';
import { findNode, toDOMNode, toDOMRange, useEditorState, useEventEditorSelectors } from '@udecode/plate-common';
import { getCellTypes } from '@udecode/plate-table';
import cx from 'classnames';
import React from 'react';
import { Range } from 'slate';
import { offset } from '@floating-ui/react';

import { isImageSelected, isTextSelected } from '../helpers';
import css from './PositionedToolbar.module.scss';

interface ToolbarProps {
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left';
}

export function FloatingToolbar(props: ToolbarProps): any {
    const editor = useEditorState();

    // useEventEditorSelectors.focus() hook is not working correctly at Safari in ShadowDOM,
    // editor focus state changes on tripple click
    // TODO: Consider upgrading Plate @udecode/* to check if this is fixed
    const inFocus = useEventEditorSelectors.focus() === editor.id;

    const getVirtualReferenceElement = () => {
        if (props.isTable) {
            const [selectedNode] = findNode(editor, {
                at: Range.start(editor.selection),
                match: { type: getCellTypes(editor) },
            });

            const domNode = toDOMNode(editor, selectedNode);

            if (!domNode) {
                return null;
            }

            return {
                getBoundingClientRect(): DOMRect {
                    return domNode.getBoundingClientRect();
                },
            };
        }

        return {
            getBoundingClientRect(): DOMRect {
                const range = toDOMRange(editor, editor.selection);

                return range.getBoundingClientRect();
            },
        };
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
            virtualTarget={ getVirtualReferenceElement() }
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
