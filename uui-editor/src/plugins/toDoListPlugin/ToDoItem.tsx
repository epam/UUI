import React from 'react';
import { FlexRow, Checkbox } from '@epam/uui';

import css from './ToDoItem.module.scss';
import { useReadOnly } from 'slate-react';
import { TTodoListItemElement } from '@udecode/plate-list';
import { PlateElement, PlateElementProps, setNodes, findNodePath, Value, useElement } from '@udecode/plate-common';

export function ToDoItem(props: PlateElementProps<Value, TTodoListItemElement>) {
    const element = useElement<TTodoListItemElement>();
    const isReadonly = useReadOnly();
    const {
        className, editor, attributes, children,
    } = props;

    const checked = element?.checked || false;

    return (
        <PlateElement asChild { ...{ ...props, rawProps: attributes } }>
            <FlexRow cx={ className }>
                <div className={ css.checkboxContainer } style={ { userSelect: 'none' } }>
                    <Checkbox
                        isReadonly={ isReadonly }
                        isDisabled={ false }
                        value={ checked }
                        rawProps={ { contentEditable: false } }
                        onValueChange={ (value) => {
                            if (isReadonly) return;
                            const path = findNodePath(editor, element);
                            if (!path) return;

                            setNodes<TTodoListItemElement>(
                                editor,
                                { checked: value },
                                { at: path },
                            );
                        } }
                    />
                </div>
                <div className={ css.textContainer }>
                    { children }
                </div>
            </FlexRow>
        </PlateElement>
    );
}
