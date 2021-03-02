import * as React from 'react';
import * as types from '@epam/uui';
import cx from 'classnames';

export interface RichTextViewProps extends types.IHasCX, types.IHasChildren {
    htmlContent?: any;
}

export class RichTextView extends React.Component<RichTextViewProps> {
    getViewByProps(content: any) {
        return <div dangerouslySetInnerHTML={ { __html: content } } className={ cx(this.props.cx) }/>;
    }

    getViewByChildren(content: any) {
        return <div className={ cx(this.props.cx) }>{ content }</div>;
    }

    render() {
        let content = this.getViewByChildren(this.props.children);

        if (this.props.htmlContent) {
            content = this.getViewByProps(this.props.htmlContent);
        }

        return content;
    }
}