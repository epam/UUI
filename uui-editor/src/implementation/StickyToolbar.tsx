import React, { MouseEventHandler, useEffect, useState } from 'react';
import cx from 'classnames';

import css from './StickyToolbar.module.scss';
import { IHasChildren, useLayer } from '@epam/uui-core';
import { isEditorFocused, useEditorRef, useEventPlateId } from '@udecode/plate-common';

interface SidebarProps extends IHasChildren {}

// eslint-disable-next-line react/function-component-definition
export const StickyToolbar: React.FC<SidebarProps> = ({ children }) => {
    const zIndex = useLayer()?.zIndex;
    const editor = useEditorRef(useEventPlateId());
    const isActive = isEditorFocused(editor);

    /**
     * This hack needs to keep toolbar open on file attach click
     * Basically for keeping UploadFileToggler mounted after files selection
     * TODO: refactoring
    */
    const [init, setInit] = useState(false);
    useEffect(() => { setInit(true); }, []);

    /**
     * Prevents unwanted event propagation of focus change (cursor hide)
     * on clicking buttons inside toolbar.
     * TODO: refactoring
     */
    const onMouseDown: MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    if (!isActive || !init) {
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
