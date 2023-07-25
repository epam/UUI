import { isBlock, usePlateEditorState } from "@udecode/plate-common";

import cx from "classnames";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

import css from "./Sidebar.module.scss";

interface SidebarProps {
    isReadonly: boolean;
    children: any;
}

export const StickyToolbar: React.FC<SidebarProps> = ({ isReadonly, children }) => {
    const editor = usePlateEditorState();
    const isBlockSelected = isBlock(editor, editor.value);
    const [isVisible, setIsVisible] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null);

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
    }

    if (isReadonly || !isVisible) return null;

    return (
        <div style={ {
            position: 'sticky',
            bottom: 12,
            display: 'flex',
            minHeight: 0,
            zIndex: 50,
        } }>
            <div onMouseDown={ onMouseDown } className={ cx("slate-prevent-blur", css.sidebar) } ref={ sidebarRef }>
                { children }
            </div>
        </div>
    );
};