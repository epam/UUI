import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";

import css from "./Sidebar.module.scss";
import { usePlateEditorState, isBlock } from "@udecode/plate-common";

interface SidebarProps {
    isReadonly: boolean;
    children: any;
}

export const Sidebar: React.FC<SidebarProps> = ({  isReadonly, children }) => {
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

    if (isReadonly || !isVisible) return null;

    return (
        <div className={ cx("slate-prevent-blur", css.sidebar) } ref={ sidebarRef }>
            { children }
        </div>
    );
};