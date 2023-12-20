import { WithPlatePlugin, isBlock, useEditorState } from '@udecode/plate-common';

import cx from 'classnames';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';

import css from './Sidebar.module.scss';
import { useLayer } from '@epam/uui-core';
import { WithButtonPlugin } from '../types';

export function StickyToolbar() {
    const editor = useEditorState();
    const isBlockSelected = isBlock(editor, editor.value);
    const [isVisible, setIsVisible] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const zIndex = useLayer()?.zIndex;

    useEffect(() => {
        const isSidebarVisible = true;

        if (isSidebarVisible !== isVisible) {
            // delay is used to make mouse click work on elements outside editor before they moved because of sidebar disappearing
            timeoutIdRef.current = setTimeout(() => {
                setIsVisible(isSidebarVisible);
            }, 50);
        }

        return () => clearTimeout(timeoutIdRef.current);
    }, [isBlockSelected, editor?.readOnly]);

    /**
     * Prevents unwanted event propagation of focus change (cursor hide)
     * on clicking buttons inside toolbar.
     */
    const onMouseDown: MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div
            style={ { zIndex } }
            className={ cx('slate-prevent-blur', css.sidebar) }
            ref={ sidebarRef }
            onMouseDown={ onMouseDown }
        >
            { editor.plugins.map((p: WithPlatePlugin<WithButtonPlugin>) => {
                const Button = p.options?.bottomBarButton;
                return Button && <Button editor={ editor } />;
            }) }
        </div>
    );
}
