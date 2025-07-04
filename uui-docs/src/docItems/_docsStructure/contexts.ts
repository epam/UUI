import {
    AnalyticsContextDocItem,
    ApiContextDocItem,
    ContextProviderDocItem, LockContextDocItem,
    ModalContextDocItem,
    NotificationContextDocItem,
} from '../contexts';

export const contextsStructure = [
    { id: 'contexts', name: 'Contexts' },
    ContextProviderDocItem,
    ApiContextDocItem,
    AnalyticsContextDocItem,
    ModalContextDocItem,
    NotificationContextDocItem,
    LockContextDocItem,
];
