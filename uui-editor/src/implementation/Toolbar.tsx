import React, { useRef } from 'react';
import { Popper } from 'react-popper';
import { usePlateEditorState, isEditorFocused, findNode, toDOMNode, getCellTypes, getSelectionBoundingClientRect } from '@udecode/plate';
import { Portal } from '@epam/uui-components';
import cx from "classnames";
import { Range } from 'slate';

import { isImageSelected, isTextSelected } from '../helpers';
import css from './Toolbar.module.scss';
import type { VirtualElement } from '@popperjs/core/lib/popper';

interface ToolbarProps {
    editor: any;
    plugins?: any;
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left' | 'auto';
}

export function Toolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>();
    const editor = usePlateEditorState();
    const inFocus = isEditorFocused(editor);

    const virtualReferenceElement = (): VirtualElement => ({
        getBoundingClientRect(): DOMRect {
            return getSelectionBoundingClientRect() as DOMRect;
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
                </Popper>
            ) }
        </Portal>
    );
}
