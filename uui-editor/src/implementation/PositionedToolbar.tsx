import { Dropdown } from '@epam/uui';
import { useForceUpdate } from '@epam/uui-core';
import { useEditorState, useEventEditorSelectors } from '@udecode/plate-common';
import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { offset, inline, type VirtualElement } from '@floating-ui/react';

import { isImageSelected, isTextSelected } from '../helpers';
import { getVirtualReferenceElement } from './PositionedToolbar.helpers';
import css from './PositionedToolbar.module.scss';

interface ToolbarProps {
    children: any;
    isImage?: boolean;
    isTable?: boolean;
    placement?: 'top' | 'bottom' | 'right' | 'left';
}

export function FloatingToolbar(props: ToolbarProps): any {
    const editor = useEditorState();
    const forceUpdate = useForceUpdate();
    const virtualTarget = useRef<VirtualElement | null>(null);

    // useEventEditorSelectors.focus() hook is not working correctly at Safari in ShadowDOM,
    // editor focus state changes on tripple click
    // TODO: Consider upgrading Plate @udecode/* to check if this is fixed
    const inFocus = useEventEditorSelectors.focus() === editor.id;

    let isToolbarVisible: boolean;
    if (props.isImage) {
        isToolbarVisible = isImageSelected(editor);
    } else {
        isToolbarVisible = !!props.isTable || isTextSelected(editor, inFocus);
    }

    useEffect(() => {
        virtualTarget.current = isToolbarVisible
            ? getVirtualReferenceElement(editor, { isTable: props.isTable })
            : null;
        forceUpdate();
    }, [JSON.stringify(editor.selection), isToolbarVisible, props.isTable]);

    return isToolbarVisible && (
        <Dropdown
            value={ isToolbarVisible }
            virtualTarget={ virtualTarget.current }
            renderTarget={ (p) => <div { ...p }></div> }
            placement={ props.placement || 'top' }
            middleware={ [
                offset(12),
                inline(),
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
