/**
 * Slate's schema has changed vastly under 2 years. The text editor is still
 * a better candidate than the other OSS editors out there, so we must live
 * with the major changes.
 *
 * Migrate a schema from the old version 0.33 to current version 0.6x
 * Inspiration taken wholly from
 * https://github.com/react-page/react-page/blob/b6c83a8650cfe9089e0c3eaf471ab58a0f7db761/packages/plugins/content/slate/src/migrations/v004.ts
 */

import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from "@udecode/plate";

const migrateTextNode = (oldNode: any) => {
    return {
        text: oldNode.text,
        ...oldNode.marks?.reduce(
            (acc: any, mark: any) => ({
                ...acc,
                ...(mark?.data?.style ? mark.data.style : {}),
                [mark.type || mark]: true,
            }),
            {}
        ),
    };
};

const migrateElementNode = (node: any) => {
    const mediaTypes = ["image", "iframe"];

    let newType;
    if (node.type === "table_row") {
        newType = "tr";
    } else if (node.type === "table_header_cell") {
        newType = "th";
    } else if (node.type === "table_cell") {
        newType = "td";
    } else if (node.type === "unordered-list") {
        newType = ELEMENT_UL;
    } else if (node.type === "ordered-list") {
        newType = ELEMENT_OL;
    } else if (node.type === "list-item") {
        newType = ELEMENT_LI;
    } else if (node.type === "list-item-child") {
        newType = ELEMENT_LIC;
    } else {
        newType = node.type;
    }

    return {
        data: node.data ?? {},
        type: newType,
        ...(mediaTypes.includes(node.type) ? { url: node.data?.src } : {}),
        ...(node?.data?.url ? { url: node.data.url } : {}),
        children: node.nodes?.map(migrateNode).flat() ?? [],
    };
};

const migrateNode = (oldNode: any) => {
    if (oldNode.object === "text") {
        return migrateTextNode(oldNode);
    } else {
        return migrateElementNode(oldNode);
    }
};

export const migrateSchema = (oldSchema: any) => {
    return oldSchema?.document?.nodes.map(migrateNode) || oldSchema;
};
