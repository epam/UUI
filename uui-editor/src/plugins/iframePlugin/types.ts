import { TElement } from '@udecode/plate-common';
import type { FileUploadResponse } from '@epam/uui-core';

export interface TIframeElement extends TElement {
    url: string;
    data?: FileUploadResponse & {
        style?: React.CSSProperties;
    };
}
