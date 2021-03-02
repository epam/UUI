import React from 'react';
import * as css from "./ErrorPage.scss";
import { UuiErrorInfo, IHasCX } from '@epam/uui';
import cx from 'classnames';


interface ErrorPageProps extends UuiErrorInfo, IHasCX {
    theme?: 'light' | 'dark';
}

export class ErrorPage extends React.Component<ErrorPageProps, any> {
    render() {
        return (
            <div className={ cx(css.container, this.props.cx, css['theme-' + (this.props?.theme || 'light')]) }>
                <div className={ css.content }>
                    <img
                        className={ css.image }
                        src={ this.props.imageUrl }
                        alt="ERROR OCCURRED!"
                    />
                    <div className={ cx(css.title, css['theme-' + (this.props?.theme || 'light')]) }>
                        { this.props.title }
                    </div>
                    <div className={ cx(css.subtitle, css['theme-' + (this.props?.theme || 'light')]) }>
                        { this.props.subtitle }
                    </div>
                </div>
            </div>
        );
    }
}