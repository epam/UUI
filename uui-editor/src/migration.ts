/**
 * Slate's schema has changed vastly under 2 years. The text editor is still
 * a better candidate than the other OSS editors out there, so we must live
 * with the major changes.
 *
 * Migrate a schema from the old version 0.33 to current version 0.6x
 * Inspiration taken wholly from
 * https://github.com/react-page/react-page/blob/b6c83a8650cfe9089e0c3eaf471ab58a0f7db761/packages/plugins/content/slate/src/migrations/v004.ts
 */

import { ExtendedTTableCellElement } from './plugins/tablePlugin/types';
import { TTableCellElement } from '@udecode/plate-table';

const mediaTypes = ['image', 'iframe'];

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

export const migrateTableCell = (element: TTableCellElement): TTableCellElement => {
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
        const newRowNodes: any[] = [];
        row.nodes.forEach((cell: any) => {
            if (cell.data?.style !== 'none') {
                newRowNodes.push(cell);
            }
        });

        row.nodes = newRowNodes;
    });
    return oldTable;
};

const migrateElementNode = (node: any) => {
    if (node.type === 'paragraph' && node.nodes?.[0]?.type === 'table') {
        const tableNode = node.nodes[0];
        node = migrateTable(tableNode);
    }

    const omitData = node.type === 'table_cell' || node.type === 'table_header_cell';
    const dataProps = omitData ? {} : { data: node.data ?? {} };
    return {
        ...dataProps,
        type: node.type,
        ...(mediaTypes.includes(node.type) ? { url: node.data?.src } : {}),
        ...(node?.data?.url ? { url: node.data.url } : {}),
        ...(node?.data?.colSpan ? { colSpan: node.data.colSpan } : {}),
        ...(node?.data?.rowSpan ? { rowSpan: node.data.rowSpan } : {}),
        children: node.nodes?.map(migrateNode).flat() ?? [],
    };
};

export const migrateNode = (oldNode: any) => {
    if (oldNode.object === 'text') {
        return migrateTextNode(oldNode);
    } else {
        return migrateElementNode(oldNode);
    }
};

export const migrateSchema = (oldSchema: any) => {
    let migratedSchema;
    try {
        migratedSchema = oldSchema?.document?.nodes.map(migrateNode);
    } catch (e) {
        console.error("Can't migrate schema", e);
    }

    if (migratedSchema) {
        return migratedSchema;
    }

    return oldSchema;
};
