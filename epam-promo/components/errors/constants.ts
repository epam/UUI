import { ApiRecoveryReason } from '@epam/uui';

export const defaultNotificationErrorMessage: string = `Sorry, there's a temporary problem. Please try again in a few moments`;

export const defaultErrorPageConfig = {
    notFound: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_404_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_404_Monochrome.svg',
        title: "Oooops! We couldn’t find this page",
        subtitle: "Sorry for the inconvenience.",
    },
    permissionDenied: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_403_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_403_Monochrome.svg',
        title: "You have no permissions!",
        subtitle: "Sorry for the inconvenience.",
    },
    serverError: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_500_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_500_Monochrome.svg',
        title: "500 Error! Something went wrong",
        subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
    },
    serviceUnavailable: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_503_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Error_503_Monochrome.svg',
        title: "The page request was canceled, because it took too long to complete",
        subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
    },
    default: {
        imageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Empty_Monochrome.svg',
        mobileImageUrl: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/error-pages-illustrations/L_Empty_Monochrome.svg',
        title: "Something went wrong",
        subtitle: "Sorry for the inconvenience, we’ll get it fixed.",
    },
};

export const recoveryWordings: Record<ApiRecoveryReason, { title: string, text: string }> = {
    'auth-lost': {
        title: 'Your session has expired.',
        text: 'Attempting to log you in.',
    },
    'connection-lost': {
        title: 'Network connection down',
        text: 'Please check your network connection.',
    },
    'maintenance': {
        title: 'Server maintenance',
        text: 'We apologize for the inconvenience. Our site is currently under maintenance. Will come back as soon as possible.',
    },
    'server-overload': {
        title: 'Server overloaded',
        text: 'We are trying to recover. Please wait.',
    },
};