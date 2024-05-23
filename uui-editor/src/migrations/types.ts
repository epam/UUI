import { TTableCellElement, TTableElement } from '@udecode/plate-table';
import { TImageElement } from '../plugins/imagePlugin/types';

/**
 * Plate related
 */

export type DeprecatedImageElement = TImageElement & {
    data: TImageElement['data'] & {
        align?: SlateImgAlign; // removed
    }
};

export type DepreactedTTableElement = TTableElement & {
    data?: {
        cellSizes?: number[]; // removed
    },
};

export type DeprecatedTTableCellElement = TTableCellElement & {
    data?: {
        colSpan?: number; // removed
        rowSpan?: number; // removed
    },
};

/**
 * Slate related
 */

/** Deprecated Slate content structure */
export type SlateSchema = {
    /** object type */
    object: 'value',
    /** document object */
    document: {
        object: 'document',
        nodes: SlateElement[];
        data?: {
            [key: string]: unknown;
        }
    }
};

export type SlateElement = SlateBlockElement | SlateInlineElement | SlateTextElement;

type ObjectType = 'text' | 'inline' | 'block' | 'mark' | 'value' | 'document';
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';

export interface SlateBaseElement {
    object: ObjectType,
    type?: string,
    nodes?: SlateElement[],
    data?: {
        url?: string; // links
        cellSizes?: number[]; // table
        align?: SlateImgAlign;
        src?: string; // media types: images, iframes

        // table cells
        colSpan?: number;
        rowSpan?: number;

        [key: string]: unknown;
    },
    [key: string]: unknown;
}

export interface SlateBlockElement extends SlateBaseElement {
    object: 'block',
    type: string;
}

export interface SlateInlineElement extends SlateBaseElement {
    object: 'inline',
    type: string;
}

export interface SlateTextElement extends SlateBaseElement {
    object: 'text',
    type?: never,
    text: string,
    marks?: SlateMark[],
}
export interface SlateMark {
    object: 'mark',
    type: string,
    data?: {
        style?: {
            [key: string]: unknown;
        },
    },
}
