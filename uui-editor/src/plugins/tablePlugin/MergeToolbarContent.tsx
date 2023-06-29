import React from "react";
import { TElementEntry, insertElements, removeNodes, usePlateEditorState } from "@udecode/plate";

import { ReactComponent as TableMerge } from "../../icons/table-merge.svg";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { createCell, getColSpan, getRowSpan } from "./utils";

export const MergeToolbarContent = ({ cellEntries }: { cellEntries: TElementEntry[] }) => {
    const editor = usePlateEditorState();

    const mergeCells = () => {
        const rowArray: any[] = [];
        cellEntries.forEach(([, path]) => rowArray.push(path[2]));

        // define colSpan
        const colSpan = cellEntries.reduce((acc, [data, path]: any) => {
            if (path[1] === cellEntries[0][1][1]) {
                const cellColSpan = getColSpan(data);
                return acc + cellColSpan;
            }
            return acc;
        }, 0);

        // define rowSpan
        const alreadyCounted: number[] = [];
        const rowSpan = cellEntries.reduce((acc, [data, path]: any) => {
            const curRowCounted = alreadyCounted.includes(path[1]);
            if (path[1] !== cellEntries[0][1][1] && !curRowCounted) {
                alreadyCounted.push(path[1]);

                const cellRowSpan = getRowSpan(data);
                return acc + cellRowSpan;
            }
            return acc;
        }, 1);

        // cols to remove
        const cols: any = {};
        let hasHeaderCell = false;
        cellEntries.forEach(([entry, path]) => {
            if (!hasHeaderCell && entry.type === 'table_header_cell') {
                hasHeaderCell = true;
            }
            if (cols[path[1]]) {
                cols[path[1]].push(path);
            } else {
                cols[path[1]] = [path];
            }
        });

        Object.values(cols).forEach((paths: any) => {
            paths?.forEach(() => {
                removeNodes(editor, { at: paths[0] });
            });
        });

        const textContent = cellEntries
            .map(([data]: any) => data?.children[0]?.children[0]?.text)
            .join(' ');
        const mergedCell = createCell({
            rowSpan,
            colSpan,
            type: hasHeaderCell ? 'table_header_cell' : 'table_cell',
            textContent
        });

        insertElements(editor, mergedCell, { at: cellEntries[0][1] });
    };

    return (
        <ToolbarButton
            onClick={ mergeCells }
            icon={ TableMerge }
        />
    );
}