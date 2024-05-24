import { Value, setNodes, PlateEditor, TNodeEntry } from '@udecode/plate-common';
import { TTableCellElement, TTableElement } from '@udecode/plate-table';
import { TImageElement } from '../plugins/imagePlugin/types';
import { toNewAlign } from './legacy_migrations';
import { DepreactedTTableElement, DeprecatedImageElement, DeprecatedTTableCellElement } from './types';

/**
 * Migration property functions
 * Currently, depreate intercepting and redundant slate properties
 * Could be used mogarte to new as plate or custom element properties
 */

/** deprecate data properties */
export const normalizeTableCellElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const tableCellNode = node as DeprecatedTTableCellElement;
    const { colSpan, rowSpan, ...otherData } = tableCellNode.data || {};

    if (!colSpan && !rowSpan) {
        return;
    }

    setNodes<TTableCellElement>(
        editor,
        { ...tableCellNode, data: { ...otherData } },
        { at: path },
    );
};

/** deprecate data properties */
export const normalizeTableElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const tableNode = node as DepreactedTTableElement;
    const { cellSizes, ...otherData } = tableNode.data || {};

    if (!cellSizes) {
        return;
    }

    setNodes<TTableElement>(
        editor,
        { ...tableNode, data: { ...otherData } },
        { at: path },
    );
};

/** deprecate intercepting properties */
export const normalizeImageElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const imageNode = node as DeprecatedImageElement;
    const { align, src, ...otherData } = imageNode.data || {};

    if (!align || !src) {
        return;
    }

    // align where setted to data after update to plate, so we need to fix that historical mistake
    const alignPayload = align ? { align: toNewAlign(align) } : {};
    const srcPayload = src ? { url: src } : {};

    setNodes<TImageElement>(
        editor,
        {
            ...imageNode,
            ...alignPayload,
            ...srcPayload,
            data: { ...otherData },
        },
        { at: path },
    );
};
