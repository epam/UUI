import * as React from 'react';
import '../index.scss';

// console.log(css)
import {
    IHasCX, IHasChildren, IHasRawProps, cx,
} from '@epam/uui-core';

export interface RichTextViewProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** HTML content to be rendered */
    htmlContent?: any;
}

export class RichTextView extends React.Component<RichTextViewProps> {
    getViewByProps(content: string) {
        return <div dangerouslySetInnerHTML={ { __html: content } } className={ cx(this.props.cx) } { ...this.props.rawProps } />;
    }

    getViewByChildren(content: React.ReactNode) {
        return (
            <div className={ cx(this.props.cx) } { ...this.props.rawProps }>
                {content}
            </div>
        );
    }

    render() {
        let content = this.getViewByChildren(this.props.children);

        if (this.props.htmlContent) {
            content = this.getViewByProps(this.props.htmlContent);
        }

        return content;
    }
}
