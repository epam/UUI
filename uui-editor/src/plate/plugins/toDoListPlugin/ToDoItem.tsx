import React from 'react';
import { uuiSkin } from '@epam/uui-core';
import {
    focusEditor,
    setElements,
} from '@udecode/plate';

import css from './ToDoItem.scss';

const { Checkbox, FlexRow } = uuiSkin;

export function ToDoItem(
    props: any,
): any {

    const { element, editor, attributes, children } = props;
    const onChange = (value: boolean, ...rest: any): any => {
        focusEditor(editor);
        setElements(editor, {
            ...element,
            data: { checked: value },
        });
    };

    return (
        <FlexRow rawProps={ attributes }>
            <div contentEditable={ false } className={ css.checkboxContainer }>
                <Checkbox value={ element.data.checked } onValueChange={ onChange }/>
            </div>
            <div className={ css.textContainer }>
                { children }
            </div>
        </FlexRow>
    );
}