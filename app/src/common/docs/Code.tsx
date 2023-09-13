import css from './Code.module.scss';
import React from 'react';

type TCode = {
    codeAsHtml: string;
    isCompact?: boolean;
};
export function Code(props: TCode) {
    const className = [css.code];
    if (props.isCompact) {
        className.push(css.compact);
    }
    return <pre className={ className.join(' ') } dangerouslySetInnerHTML={ { __html: props.codeAsHtml } } />;
}
