import { TElement } from '@udecode/plate-common';
import { FileUploadResponse } from '@epam/uui-core';

export interface TAttachmentElement extends TElement {
    // safe required, since could only be created from file upload
    data: FileUploadResponse & {
        // TODO: the same as name in upload response type, should be removed and normilized than
        fileName?: string;
    };
}
