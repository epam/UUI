import { GetAboveNodeOptions, PlateEditor, TElementEntry, getEdgeBlocksAbove, TElement, Value } from '@udecode/plate-common';
import { GetTableGridByRangeOptions, getCellTypes, getEmptyTableNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getTableGridByRange } from './getTableGridByRange';

export type GetTableGridAboveOptions<V extends Value = Value> =
    GetAboveNodeOptions<V> & Pick<GetTableGridByRangeOptions, 'format'>;

/**
   * Get sub table above anchor and focus.
   * Format: tables or cells.
   */
export const getTableGridAbove = <V extends Value = Value>(
    editor: PlateEditor<V>,
    { format = 'table', ...options }: GetTableGridAboveOptions<V> = {},
): TElementEntry[] => {
    const edges = getEdgeBlocksAbove<TElement>(editor, {
        match: {
            type: getCellTypes(editor),
        },
        ...options,
    });

    // console.log('getting ttable grid above', edges);

    if (edges) {
        const [start, end] = edges;

        if (!Path.equals(start[1], end[1])) {
            return getTableGridByRange(editor, {
                at: {
                    anchor: {
                        path: start[1],
                        offset: 0,
                    },
                    focus: {
                        path: end[1],
                        offset: 0,
                    },
                },
                format,
            } as any);
        }

        if (format === 'table') {
            const table = getEmptyTableNode(editor, { rowCount: 1 });
            table.children[0].children = [start[0]];
            return [[table, start[1].slice(0, -2)]];
        }

        return [start];
    }

    return [];
};
