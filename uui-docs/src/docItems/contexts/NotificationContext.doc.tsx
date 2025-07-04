import { DocItem } from '../_types/docItem';

export const NotificationContextDocItem: DocItem = {
    id: 'notificationContextDoc',
    name: 'Notification Context',
    parentId: 'contexts',
    examples: [
        { descriptionPath: 'notification-context-descriptions' },
        { name: 'Example', componentPath: './_examples/contexts/NotificationContext.example.tsx' },
    ],
    tags: ['contexts'],
};
