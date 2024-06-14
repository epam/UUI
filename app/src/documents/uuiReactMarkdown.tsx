import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import * as React from 'react';

interface UuiReactMarkdownProps {
    content: string;
    isReplaceStrongToBold?: boolean;
}

/**
 * Supports GitHub Flavored Markdown (or GFM) out of the box.
 * GFM is the dialect of Markdown that is currently supported
 * for user content on GitHub.com and GitHub Enterprise.
 * @param props
 * @constructor
 */
export function UuiReactMarkdown(props: React.PropsWithChildren<UuiReactMarkdownProps>) {
    const { isReplaceStrongToBold } = props;

    const comp = React.useMemo(() => {
        const c: Components = {};
        if (isReplaceStrongToBold) {
            c.strong = ({ node, ...props }) => <b>{props.children}</b>;
        }
        c.a = ({ node, children, ...props }) => {
            return <a { ...props } target="_blank">{children}</a>;
        };
        return c;
    }, [isReplaceStrongToBold]);

    return (
        <ReactMarkdown remarkPlugins={ [RemarkGfm] } components={ comp }>
            {props.content}
        </ReactMarkdown>
    );
}
