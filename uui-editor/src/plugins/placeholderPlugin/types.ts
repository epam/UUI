import { TElement } from '@udecode/plate-common';

export interface TPlaceholderElement extends TElement {
    data: {
        name: string;
        [key: string]: any;
    };
}
