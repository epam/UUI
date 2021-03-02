import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class ChangeManagementProcessDoc extends BaseDocsBlock {
    title = 'Change Management Process';


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='change-management-process' />
            </>
        );
    }
}
