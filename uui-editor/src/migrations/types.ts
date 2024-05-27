import { TLinkElement } from '@udecode/plate-link';
import { TTableCellElement, TTableElement } from '@udecode/plate-table';
import { TAttachmentElement } from '../plugins/attachmentPlugin/types';
import { TIframeElement } from '../plugins/iframePlugin/types';
import { TImageElement } from '../plugins/imagePlugin/types';

/**
 * Deprecated plate schema types
 */

export type DeprecatedImageElement = TImageElement & {
    data: TImageElement['data'] & {
        src?: string; // removed
        align?: SlateImgAlign; // removed
        imageSize?: { // removed
            width?: number;
            height?: number;
        }
    }
};

export type DepreactedTTableElement = TTableElement & {
    data?: TTableElement['data'] & {
        cellSizes?: number[]; // removed
    },
};

export type DeprecatedTTableCellElement = TTableCellElement & {
    data?: TTableCellElement['data'] & {
        colSpan?: number; // removed
        rowSpan?: number; // removed
    },
};

export type DeprecatedTLinkElement = TLinkElement & {
    data?: TLinkElement['data'] & {
        url?: string; // removed
    }
};

export type DeprecatedTIframeElement = TIframeElement & {
    data: TIframeElement['data'] & {
        src?: string; // removed
    }
};

export type DeprecatedTAttachmentElement = TAttachmentElement & {
    data?: TAttachmentElement['data'] & {
        src?: string; // removed
    }
};

/**
 * Legacy slate schema types
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
        [key: string]: unknown;
    }
    /** any other key */
    [key: string]: unknown;
};

export type SlateElement = SlateBlockElement | SlateInlineElement | SlateTextElement;

type ObjectType = 'text' | 'inline' | 'block' | 'mark' | 'value' | 'document';
export type SlateImgAlign = 'align-left' | 'align-right' | 'align-center';

interface DataObject {
    url?: string; // links
    cellSizes?: number[]; // table
    align?: SlateImgAlign;
    src?: string; // media types: images, iframes

    // images
    imageSize?: {
        width?: number;
        height?: number;
    }

    // table cells
    colSpan?: number;
    rowSpan?: number;

    // attachment / iframe / image
    path?: string;

    // any other custom stuff
    [key: string]: unknown;
}

interface SlateBaseElement {
    object: ObjectType,
    type?: string,
    nodes?: SlateElement[],
    data?: DataObject,
    [key: string]: unknown,
}

export interface SlateBlockElement extends SlateBaseElement {
    object: 'block',
    type: string,
}

export interface SlateInlineElement extends SlateBaseElement {
    object: 'inline',
    type: string,
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
    data?: DataObject & {
        style?: {
            [key: string]: unknown;
        }
    },
}
