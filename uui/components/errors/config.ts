import { ApiRecoveryReason } from '@epam/uui-core';
import { i18n } from '../../i18n';

export const getRecoveryMessageConfig: () => Record<ApiRecoveryReason, { title: string; subtitle: string }> = () => ({
    'auth-lost': i18n.errorHandler.recoveryMessageConfig['auth-lost'],
    'connection-lost': i18n.errorHandler.recoveryMessageConfig['connection-lost'],
    maintenance: i18n.errorHandler.recoveryMessageConfig.maintenance,
    'server-overload': i18n.errorHandler.recoveryMessageConfig['server-overload'],
});

export const getErrorPageConfig = () => ({
    notFound: {
        imageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/404.svg',
        mobileImageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/404.svg',
        title: i18n.errorHandler.errorPageConfig.notFound.title,
        subtitle: i18n.errorHandler.errorPageConfig.notFound.subtitle,
    },
    permissionDenied: {
        imageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/403.svg',
        mobileImageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/403.svg',
        title: i18n.errorHandler.errorPageConfig.permissionDenied.title,
        subtitle: i18n.errorHandler.errorPageConfig.permissionDenied.subtitle,
    },
    serverError: {
        imageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/500.svg',
        mobileImageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/500.svg',
        title: i18n.errorHandler.errorPageConfig.serverError.title,
        subtitle: i18n.errorHandler.errorPageConfig.serverError.subtitle,
        supportLink: i18n.errorHandler.supportMessage,
    },
    serviceUnavailable: {
        imageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/503.svg',
        mobileImageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/503.svg',
        title: i18n.errorHandler.errorPageConfig.serviceUnavailable.title,
        subtitle: i18n.errorHandler.errorPageConfig.serviceUnavailable.subtitle,
        supportLink: i18n.errorHandler.supportMessage,
    },
    default: {
        imageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/Something went wrong.svg',
        mobileImageUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-2025/Something went wrong.svg',
        title: i18n.errorHandler.errorPageConfig.default.title,
        subtitle: i18n.errorHandler.errorPageConfig.default.subtitle,
        supportLink: i18n.errorHandler.supportMessage,
    },
});
