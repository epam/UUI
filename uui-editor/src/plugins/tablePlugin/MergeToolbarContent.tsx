import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange } from '@udecode/plate-common';
import { TTableCellElement, getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';

export function MergeToolbarContent({ cellEntries: selectedCellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const mergeCells = () => {
        const {
            colSpan,
            rowSpan,
        } = selectedCellEntries.reduce(
            (acc, current, index) => {
                const [el, path] = current;
                const cellElement: TTableCellElement = el;

                // TODO: Think about improvement here.
                // Since they are not really indexes here when there are cells merged in the table
                const [rowIndex, colIndex] = path.slice(-2);

                if (acc.currentRowIndex !== rowIndex || index === 0) {
                    acc.rowSpan += cellElement.rowSpan as number || 1;
                    acc.currentRowIndex = rowIndex;
                }

                if (colIndex > acc.currentColIndex || index === 0) {
                    acc.colSpan += cellElement.colSpan || 1;
                    acc.currentColIndex = colIndex;
                }

                return acc;
            },
            {
                colSpan: 0,
                rowSpan: 0,
                currentRowIndex: 0,
                currentColIndex: 0,
            },
        );

        const contents = [];
        const paths: Path[] = [];
        for (const cellEntry of selectedCellEntries) {
            const [el, path] = cellEntry;
            paths.push(path);
            contents.push(...el.children);
        }

        removeNodes(editor, {
            at: getRange(editor, paths.at(0)!, paths.at(-1)!),
            match: (_, path) => {
                if (paths.some((p) => Path.equals(p, path))) {
                    return true;
                }
                return false;
            },
        });

        const mergedCell = {
            ...getEmptyCellNode(editor, {
                header: selectedCellEntries[0][0].type === 'th',
                newCellChildren: contents,
            }),
            colSpan,
            rowSpan,
        };

        insertElements(editor, mergedCell, { at: selectedCellEntries[0][1] });
    };

    return (
        <ToolbarButton
            onClick={ mergeCells }
            icon={ TableMerge }
        />
    );
}
