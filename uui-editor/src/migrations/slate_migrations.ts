/**
 * Slate's schema has changed vastly under 2 years. The text editor is still
 * a better candidate than the other OSS editors out there, so we must live
 * with the major changes.
 *
 * Migrate a schema from the old version 0.33 to current version 0.6x
 * Inspiration taken wholly from
 * https://github.com/react-page/react-page/blob/b6c83a8650cfe9089e0c3eaf471ab58a0f7db761/packages/plugins/content/slate/src/migrations/v004.ts
 */

import { Value } from '@udecode/plate-common';
import { PlateImgAlign, SlateImgAlign } from '../plugins/imagePlugin/types';
import { ExtendedTTableCellElement } from '../plugins/tablePlugin/types';
import { TTableCellElement } from '@udecode/plate-table';

const migrateTextNode = (oldNode: any) => {
    return {
        text: oldNode.text,
        ...oldNode.marks?.reduce(
            (acc: any, mark: any) => ({
                ...acc,
                ...(mark?.data?.style ? mark.data.style : {}),
                [mark.type || mark]: true,
            }),
            {},
        ),
    };
};

export const migrateTableCell = (
    element: TTableCellElement,
): TTableCellElement => {
    const oldElem = element as ExtendedTTableCellElement;
    if (oldElem.data) {
        if (oldElem.data.colSpan) {
            element.colSpan = oldElem.data.colSpan;
        }
        if (oldElem.data.rowSpan) {
            element.rowSpan = oldElem.data.rowSpan;
        }
        delete element.data;
    }
    return element;
};

const migrateTable = (oldTable: any) => {
    oldTable.nodes.forEach((row: any) => {
        const newRowCells: any[] = [];
        row.nodes.forEach((cell: any) => {
            if (cell.data?.style !== 'none') {
                newRowCells.push(cell);
            }
        });

        if (!newRowCells.length) {
            newRowCells.push({
                object: 'text',
                text: '',
            });
        }
        row.nodes = newRowCells;
    });
    return oldTable;
};

// image
const SLATE_TO_PLATE_IMG_ALIGN = {
    'align-left': 'left',
    'align-right': 'right',
    'align-center': 'center',
};
export const toPlateAlign = (slateAlign: SlateImgAlign) =>
    SLATE_TO_PLATE_IMG_ALIGN[slateAlign] as PlateImgAlign;

const migrateElementNode = (node: any) => {
    if (node.object === 'text') {
        return migrateTextNode(node);
    }

    const omitData = node.type === 'table_cell'
        || node.type === 'table_header_cell'
        || node.type === 'image';
    let newNode: any = {};
    if (node.type === 'paragraph' && node.nodes?.[0]?.type === 'table') {
        const tableNode = node.nodes[0];
        // modifyes table structure the old format still. than, each row and cell will be migrated
        newNode = migrateTable(tableNode);
    }

    const dataProps = omitData ? {} : { data: node.data ?? {} };
    return {
        // default setup
        ...dataProps,
        type: node.type,
        children: node.nodes?.map(migrateElementNode).flat() ?? [],

        // additional stuff
        ...(node?.data?.url ? { url: node.data?.src } : {}),
        ...(node.data?.path ? { url: node.data?.path } : {}),
        ...(node?.data?.align ? { align: toPlateAlign(node.data?.align) } : {}),
        ...(node?.data?.colSpan ? { colSpan: node.data.colSpan } : {}),
        ...(node?.data?.rowSpan ? { rowSpan: node.data.rowSpan } : {}),
    };
};

export const migrateSlateSchema = (oldSchema: any): Value => {
    let migratedSchema;
    try {
        migratedSchema = oldSchema?.document?.nodes.map(migrateElementNode);
    } catch (e) {
        console.error("Can't migrate schema", e);
    }

    if (migratedSchema) {
        return migratedSchema;
    }

    return oldSchema;
};
