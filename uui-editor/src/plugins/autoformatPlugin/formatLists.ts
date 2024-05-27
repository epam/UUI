import { AutoformatRule } from '@udecode/plate-autoformat';
import { TTodoListItemElement } from '@udecode/plate-list';
import { formatList, preFormat } from './formatUtils';
import { isBlock, setNodes } from '@udecode/plate-common';
import { LI_TYPE, OL_TYPE, UL_TYPE } from '../listPlugin';
import { TODO_TYPE } from '../toDoListPlugin';

export const autoformatLists: AutoformatRule[] = [
    {
        mode: 'block',
        type: LI_TYPE,
        match: ['* ', '- '],
        preFormat,
        format: (editor) => {
            formatList(editor, UL_TYPE);
        },
    },
    {
        mode: 'block',
        type: LI_TYPE,
        match: ['1. ', '1) '],
        preFormat,
        format: (editor) => formatList(editor, OL_TYPE),
    },
    {
        mode: 'block',
        type: TODO_TYPE,
        match: '[] ',
    },
    {
        mode: 'block',
        type: TODO_TYPE,
        match: '[x] ',
        format: (editor) =>
            setNodes<TTodoListItemElement>(
                editor,
                {
                    type: TODO_TYPE,
                    checked: true,
                },
                {
                    match: (n) => isBlock(editor, n),
                },
            ),
    },
];
