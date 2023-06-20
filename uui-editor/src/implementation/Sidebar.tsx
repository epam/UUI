import React, { useEffect, useRef, useState } from "react";
import css from "./Sidebar.module.scss";
import { Editor, Plugins } from "slate-react";
import flatten from "lodash.flatten";
import cx from "classnames";

interface SidebarProps {
    editor: Editor;
    plugins: Plugins;
    isReadonly: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ editor, plugins, isReadonly }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        const isSidebarVisible = editor?.value.focusBlock
            && editor?.value.selection.isFocused
            && !editor?.readOnly;
        
        if (isSidebarVisible !== isVisible) {
            // delay is used to make mouse click work on elements outside editor before they moved because of sidebar disappearing
            timeoutIdRef.current = setTimeout(() => {
                setIsVisible(isSidebarVisible);
            }, 50);
        }

        return () => clearTimeout(timeoutIdRef.current);
    }, [editor?.value.focusBlock, editor?.value.selection.isFocused, editor?.readOnly]);

    if (isReadonly || !isVisible) return null;

    return (
        <div className={ cx("slate-prevent-blur", css.sidebar) } ref={ sidebarRef }>
            { flatten(plugins).map((plugin: any) => (
                plugin.sidebarButtons?.map((Button: any, index: number) => (
                    <Button editor={ editor } key={ `button-${ index }` }/>
                ))
            )) }
        </div>
    );
};