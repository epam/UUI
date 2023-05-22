import React from 'react';
import { uuiSkin } from '@epam/uui-core';
import {
    setElements,
    findNodePath,
} from '@udecode/plate';

import css from './ToDoItem.module.scss';

const { Checkbox, FlexRow } = uuiSkin;

export function ToDoItem(
    props: any,
): any {

    const { element, editor, attributes, children } = props;

    const onChange = (value: boolean): any => {
        editor.selection = {
            focus: { offset: 0, path: [findNodePath(editor, element)[0], 0] },
            anchor: { offset: 0, path: [findNodePath(editor, element)[0], 0] },
        };

        setElements(editor, {
            ...element,
            data: { checked: value },
        });
    };

    return (
        <FlexRow rawProps={ attributes }>
            <div className={ css.checkboxContainer }>
                <Checkbox
                    value={ element?.data?.checked }
                    onValueChange={ onChange }
                />
            </div>
            <div className={ css.textContainer }>
                { children }
            </div>
        </FlexRow>
    );
}