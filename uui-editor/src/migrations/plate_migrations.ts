import { Value, setNodes, PlateEditor, TNodeEntry, TNode } from '@udecode/plate-common';
import { TImageElement } from '@udecode/plate-media';
import { TTableCellElement, TTableElement } from '@udecode/plate-table';
import { toPlateAlign } from '../helpers';
import { IImageElement } from '../plugins/imagePlugin/types';
import { ExtendedTTableCellElement, ExtendedTTableElement } from '../plugins/tablePlugin/types';

export const CONTENT_VERSION = '5.7.3';
export const DEFAULT_CONTENT_VERSION = '5.7.2';

/** 5.7.3 content properties migrations */
export const MIGRATIONS_5_7_3 = '5.7.3';

/** deprecate data properties */
const migrateTableCellElementTo_5_7_3 = (editor: PlateEditor<Value>, tableCellNode: ExtendedTTableCellElement, path: number[]) => {
    if (!tableCellNode.data?.colSpan && !tableCellNode.data?.rowSpan) {
        return;
    }

    const payload = {
        ...tableCellNode,
        data: { version: CONTENT_VERSION },
    };

    setNodes<TTableCellElement>(
        editor,
        payload,
        { at: path },
    );
};

/** deprecate data properties */
const migarteTableElementTo_5_7_3 = (editor: PlateEditor<Value>, tableNode: ExtendedTTableElement, path: number[]) => {
    if (!tableNode.data?.cellSizes) {
        return;
    }

    const payload = {
        ...tableNode,
        data: {
            version: CONTENT_VERSION,
        },
    };

    setNodes<TTableElement>(
        editor,
        payload,
        { at: path },
    );
};

/** deprecate plate intercepting properties */
const migarteImageElementTo_5_7_3 = (editor: PlateEditor<Value>, imageNode: IImageElement, path: number[]) => {
    // align where setted to data after update to plate, so we need to fix that historical mistake
    const alignPayload = imageNode.data?.align ? {
        align: toPlateAlign(imageNode.data.align),
    } : {};

    /** deprecate slate property */
    delete imageNode.data?.align;

    const payload = {
        ...imageNode,
        ...alignPayload,
        data: {
            ...(imageNode.data || {}),
            version: CONTENT_VERSION,
        },
    };

    setNodes<TImageElement>(
        editor,
        payload,
        { at: path },
    );
};

export const migrateTableCellElement = (editor: PlateEditor<Value>, entry: TNodeEntry<TNode>) => {
    const [node, path] = entry;
    const tableCellNode = node as ExtendedTTableCellElement;
    const usedVerion = tableCellNode.data?.version || DEFAULT_CONTENT_VERSION;

    if (usedVerion < MIGRATIONS_5_7_3) {
        migrateTableCellElementTo_5_7_3(editor, tableCellNode, path);
    }
};

export const migrateTableElement = (editor: PlateEditor<Value>, entry: TNodeEntry<TNode>) => {
    const [node, path] = entry;
    const tableNode = node as ExtendedTTableElement;
    const usedVerion = tableNode.data?.version || DEFAULT_CONTENT_VERSION;

    if (usedVerion < MIGRATIONS_5_7_3) {
        migarteTableElementTo_5_7_3(editor, tableNode, path);
    }
};

export const migrateImageElement = (editor: PlateEditor<Value>, entry: TNodeEntry<TNode>) => {
    const [node, path] = entry;
    const imageNode = node as IImageElement;
    const usedVerion = imageNode.data?.version || DEFAULT_CONTENT_VERSION;

    if (usedVerion < MIGRATIONS_5_7_3) {
        migarteImageElementTo_5_7_3(editor, imageNode, path);
    }
};
