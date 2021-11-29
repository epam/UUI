import { ApiRecoveryReason } from '@epam/uui';
import { i18n } from '../../i18n';

export const recoveryMessageConfig: Record<ApiRecoveryReason, { title: string, subtitle: string }> = {
    'auth-lost': i18n.errorHandler.recoveryMessageConfig['auth-lost'],
    'connection-lost': i18n.errorHandler.recoveryMessageConfig['connection-lost'],
    'maintenance': i18n.errorHandler.recoveryMessageConfig.maintenance,
    'server-overload': i18n.errorHandler.recoveryMessageConfig['server-overload'],
};

export const errorPageConfig = {
    notFound: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_404_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_404_Monochrome.svg',
        title: i18n.errorHandler.errorPageConfig.notFound.title,
        subtitle: i18n.errorHandler.errorPageConfig.notFound.subtitle,
    },
    permissionDenied: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_403_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_403_Monochrome.svg',
        title: i18n.errorHandler.errorPageConfig.permissionDenied.title,
        subtitle: i18n.errorHandler.errorPageConfig.permissionDenied.subtitle,
    },
    serverError: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_500_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_500_Monochrome.svg',
        title: i18n.errorHandler.errorPageConfig.serverError.title,
        subtitle: i18n.errorHandler.errorPageConfig.serverError.subtitle,
    },
    serviceUnavailable: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_503_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_503_Monochrome.svg',
        title: i18n.errorHandler.errorPageConfig.serviceUnavailable.title,
        subtitle: i18n.errorHandler.errorPageConfig.serviceUnavailable.subtitle,
    },
    default: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Empty_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Empty_Monochrome.svg',
        title: i18n.errorHandler.errorPageConfig.default.title,
        subtitle: i18n.errorHandler.errorPageConfig.default.subtitle,
    },
};