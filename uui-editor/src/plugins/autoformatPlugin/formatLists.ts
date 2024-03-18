import { AutoformatRule } from '@udecode/plate-autoformat';
import { TTodoListItemElement } from '@udecode/plate-list';
import { formatList, preFormat } from './formatUtils';
import { isBlock, setNodes } from '@udecode/plate-common';
import {
    ELEMENT_LI_CUSTOM, ELEMENT_OL_CUSTOM, ELEMENT_UL_CUSTOM,
} from '../listPlugin/constants';
import { TODO_ELEMENT_KEY } from '../toDoListPlugin/toDoListPlugin';

export const autoformatLists: AutoformatRule[] = [
    {
        mode: 'block',
        type: ELEMENT_LI_CUSTOM,
        match: ['* ', '- '],
        preFormat,
        format: (editor) => {
            console.log('format list');
            formatList(editor, ELEMENT_UL_CUSTOM);
        },
    },
    {
        mode: 'block',
        type: ELEMENT_LI_CUSTOM,
        match: ['1. ', '1) '],
        preFormat,
        format: (editor) => formatList(editor, ELEMENT_OL_CUSTOM),
    },
    {
        mode: 'block',
        type: TODO_ELEMENT_KEY,
        match: '[] ',
    },
    {
        mode: 'block',
        type: TODO_ELEMENT_KEY,
        match: '[x] ',
        format: (editor) =>
            setNodes<TTodoListItemElement>(
                editor,
                {
                    type: TODO_ELEMENT_KEY,
                    checked: true,
                },
                {
                    match: (n) => isBlock(editor, n),
                },
            ),
    },
];
