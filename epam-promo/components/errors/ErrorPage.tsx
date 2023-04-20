import React from 'react';
import { UuiErrorInfo, IHasCX, isMobile, cx } from '@epam/uui-core';
import css from './ErrorPage.scss';

interface ErrorPageProps extends UuiErrorInfo, IHasCX {}

export const ErrorPage: React.FC<ErrorPageProps> = (props) => {
    const isMobileScreen = isMobile();

    return (
        <div className={cx(css.container, props.cx)}>
            <div className={'uui-error-content'}>
                <img className={'uui-error-image'} src={isMobileScreen && props.mobileImageUrl ? props.mobileImageUrl : props.imageUrl} alt="ERROR OCCURRED!" />
                <div className={'uui-error-title'}>{props.title}</div>
                <div className={'uui-error-subtitle'}>{props.subtitle}</div>
            </div>
        </div>
    );
};
