import React, { useRef } from 'react';
import { Popper } from 'react-popper';
import { usePlateEditorState, isEditorFocused, getSelectionBoundingClientRect } from '@udecode/plate';
import { Portal } from '@epam/uui-components';
import cx from "classnames";

import { isImageSelected, isTextSelected } from '../helpers';
import css from './Toolbar.scss';

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

    const virtualReferenceElement = () => {
        return {
            clientWidth: getSelectionBoundingClientRect().width,
            clientHeight: getSelectionBoundingClientRect().height,
            getBoundingClientRect(): any {
                const native = window.getSelection();
                const range = native?.getRangeAt(0);
                return getSelectionBoundingClientRect();
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
                            style={ { ...popperProps.style, zIndex: 10 } }
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
