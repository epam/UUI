import React, { MouseEventHandler } from 'react';
import cx from 'classnames';

import css from './StickyToolbar.module.scss';
import { useLayer } from '@epam/uui-core';
import { useEditorRef, useEventEditorSelectors } from '@udecode/plate-common';

interface SidebarProps {
    children: JSX.Element[];
}

// eslint-disable-next-line react/function-component-definition
export const StickyToolbar: React.FC<SidebarProps> = ({ children }) => {
    const editorRef = useEditorRef();
    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editorRef.id === focusedEditorId;

    const zIndex = useLayer()?.zIndex;

    /**
     * Prevents unwanted event propagation of focus change (cursor hide)
     * on clicking buttons inside toolbar.
     */
    const onMouseDown: MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    if (!isFocused) {
        return null;
    }

    return (
        <div style={ {
            position: 'sticky',
            bottom: 12,
            display: 'flex',
            minHeight: 52,
            zIndex,
        } }
        >
            <div
                onMouseDown={ onMouseDown }
                className={ cx('slate-prevent-blur', css.sidebar) }
            >
                { children }
            </div>
        </div>
    );
};
