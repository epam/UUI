import * as React from 'react';
import * as css from './Page.scss';
import { cx, IHasChildren } from '@epam/uui';
import { ErrorHandler } from '@epam/promo';

export interface PageProps extends IHasChildren {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
}

export class Page extends React.Component<PageProps, any> {
    render() {
        return (
            <div className={ css.root }>
                <header>
                    { this.props.renderHeader && this.props.renderHeader() }
                </header>
                <ErrorHandler cx={ css.errorBlock }>
                    <main className={ cx(css.content, this.props.contentCx) } >
                        { this.props.children }
                    </main>
                    <footer>
                        { this.props.renderFooter && this.props.renderFooter() }
                    </footer>
                </ErrorHandler>
            </div>
        );
    }
}