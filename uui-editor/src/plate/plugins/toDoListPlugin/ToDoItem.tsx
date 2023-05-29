import React, { useState } from 'react';
import { uuiSkin } from '@epam/uui-core';
import {
    setElements,
    findNodePath,
} from '@udecode/plate';

import css from './ToDoItem.module.scss';
import { useReadOnly } from 'slate-react';

const { Checkbox, FlexRow } = uuiSkin;

export function ToDoItem(
    props: any,
): any {
    const isReadonly = useReadOnly();
    const { element, editor, attributes, children } = props;
    const [checked, setChecked] = useState(element.data?.checked ?? false);

    const onChange = (event: React.MouseEvent<Element, MouseEvent>) => {
        const targetElem = event.target as unknown as Element;
        if (targetElem.tagName !== 'DIV') return;
        event.preventDefault();
        event.stopPropagation();

        editor.selection = {
            focus: { offset: 0, path: [findNodePath(editor, element)[0], 0] },
            anchor: { offset: 0, path: [findNodePath(editor, element)[0], 0] },
        };

        const value = !checked;
        setChecked(value);
        setElements(editor, {
            ...element,
            data: { checked: value },
        });
    };

    const rawProps = { onClick: onChange }

    return (
        <FlexRow rawProps={ attributes }  >
            <div className={ css.checkboxContainer }>
                <Checkbox
                    cx={ css.checkboxElement }
                    isReadonly={ isReadonly }
                    isDisabled={ false }
                    value={ checked }
                    rawProps={ rawProps }
                    onValueChange={ () => {} }
                />
            </div>
            <div className={ css.textContainer }>
                { children }
            </div>
        </FlexRow>
    );
}