import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class NotificationContextDoc extends BaseDocsBlock {
    title = 'Notification Context';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="notification-context-descriptions" />
                <DocExample title="Example" path="./_examples/contexts/NotificationContext.example.tsx" />
            </>
        );
    }
}
