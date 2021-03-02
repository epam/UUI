import * as React from 'react';
import * as css from './Page.scss';
import { cx } from '@epam/uui';

export interface PageProps {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
}

export class Page extends React.Component<PageProps, any> {
    render() {
        return (
            <div className={ css.root } >
                { this.props.renderHeader && this.props.renderHeader() }
                <div className={ cx(css.content, this.props.contentCx) } >
                    { this.props.children }
                </div>
                { this.props.renderFooter && this.props.renderFooter() }
            </div>
        );
    }
}