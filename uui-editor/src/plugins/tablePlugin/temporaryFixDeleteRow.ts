import { isType, type PlateEditor, getBlockAbove } from '@udecode/plate-common';
import { TABLE_TYPE } from './constants';
import type { TableElementType } from './types';

/**
* Remove fix wrapper function when `@udecode/plate-table` will be updated to 40.0.0
* See {@link https://github.com/udecode/plate/blob/f8fa0e7f4c0b4dd3ab445fd0aa55738db1596de9/packages/table/CHANGELOG.md#4000} for details
*/
export const temporaryFixDeleteRow = (editor: PlateEditor, deleteRowFn: () => void) => {
    return () => {
        const tableElement = getBlockAbove<TableElementType>(editor, { match: (node) => isType(editor, node, TABLE_TYPE) });

        if (!tableElement) {
            return;
        }

        const [tableNode] = tableElement;

        if (tableNode.children.length <= 1) {
            return;
        }

        deleteRowFn();
    };
};
