import { Value, setNodes, PlateEditor, TNodeEntry, TNode } from '@udecode/plate-common';
import { TImageElement } from '@udecode/plate-media';
import { IImageElement, SlateImgAlign } from '../plugins/imagePlugin/types';
import { ExtendedTTableCellElement, ExtendedTTableElement } from '../plugins/tablePlugin/types';

export const CONTENT_VERSION = '5.7.3';
export const DEFAULT_CONTENT_VERSION = '5.7.2';

/** 5.7.3 content properties migrations */
export const MIGRATIONS_5_7_3 = '5.7.3';

const migrateTableCellElementTo_5_7_3 = (editor: PlateEditor<Value>, tableCellNode: ExtendedTTableCellElement, path: number[]) => {
    if (!tableCellNode.data?.colSpan && !tableCellNode.data?.rowSpan) {
        return;
    }

    const colSpan = tableCellNode.colSpan || tableCellNode.data?.colSpan;
    const colSpanPayload = colSpan ? { colSpan } : {};

    const rowSpan = tableCellNode.rowSpan || tableCellNode.data?.rowSpan;
    const rowSpanPayload = rowSpan ? { rowSpan } : {};

    const payload = {
        ...tableCellNode,
        ...rowSpanPayload,
        ...colSpanPayload,
        data: { version: CONTENT_VERSION },
    };

    setNodes(
        editor,
        payload,
        { at: path },
    );
};

const migarteTableElementTo_5_7_3 = (editor: PlateEditor<Value>, tableNode: ExtendedTTableElement, path: number[]) => {
    const colSizesPayload = !!tableNode.data?.cellSizes
        ? { colSizes: [...tableNode.data.cellSizes] }
        : {};
    const payload = {
        ...tableNode,
        ...colSizesPayload,
        data: {
            version: CONTENT_VERSION,
        },
    };

    setNodes(
        editor,
        payload,
        { at: path },
    );
};

const SLATE_TO_PLATE_IMG_ALIGN = {
    'align-left': 'left',
    'align-right': 'right',
    'align-center': 'center',
};
const toPlateAlign = (slateAlign: SlateImgAlign): TImageElement['align'] =>
    SLATE_TO_PLATE_IMG_ALIGN[slateAlign] as TImageElement['align'];

const migarteImageElementTo_5_7_3 = (editor: PlateEditor<Value>, imageNode: IImageElement, path: number[]) => {
    const alignPayload = imageNode.data?.align ? {
        align: toPlateAlign(imageNode.data.align),
    } : {};

    /** safe delete deprecated properties, since they are literals */
    delete imageNode.data.src;
    delete imageNode.data.align;

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
