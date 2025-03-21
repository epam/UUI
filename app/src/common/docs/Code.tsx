import React from 'react';
import { IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './Code.module.scss';

type TCode = IHasCX & {
    codeAsHtml: string;
    isCompact?: boolean;
    isVisible?: boolean;
};
export function Code(props: TCode) {
    const classNames = cx(css.code, !props.isVisible && css.isHidden, props.isCompact && css.compact, props.cx);

    return <pre itemScope itemType="http://schema.org/Code" className={ classNames } dangerouslySetInnerHTML={ { __html: props.codeAsHtml } } aria-expanded={ props.isVisible } />;
}
