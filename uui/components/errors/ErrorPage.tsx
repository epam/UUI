import React from 'react';
import { IHasCX, isMobile, cx, ErrorPageInfo } from '@epam/uui-core';
import css from './ErrorPage.module.scss';

interface ErrorPageProps extends ErrorPageInfo, IHasCX {}

export const ErrorPage: React.FC<ErrorPageProps> = (props) => {
    const isMobileScreen = isMobile();

    return (
        <div className={ cx(css.container, props.cx) }>
            <div className="uui-error-content">
                <img className="uui-error-image" src={ isMobileScreen && props.mobileImageUrl ? props.mobileImageUrl : props.imageUrl } alt="ERROR OCCURRED!" />
                <div className="uui-error-title">{props.title}</div>
                <div className="uui-error-subtitle">{props.subtitle}</div>
                <div className="uui-error-support-link">{props?.supportLink}</div>
            </div>
        </div>
    );
};
