import React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import * as types from '../types';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import css from './TextPlaceholder.scss';

export interface TextPlaceholderProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    wordsCount?: number;
    color?: types.EpamColor;
    isNotAnimated?: boolean;
}

export const TextPlaceholder = React.forwardRef<HTMLDivElement, TextPlaceholderProps>((props, ref) => {
    const pattern = `&nbsp;`;
    const text = React.useMemo(() => {
        const words = [];
        for (let i = 0; i < (props.wordsCount || 1); i++) {
            const lengthWord = Math.floor(Math.random() * 10 + 8);
            words.push(pattern.repeat(lengthWord));
        }
        return words;
    }, [props.wordsCount]);

    return (
        <div ref={ ref } aria-busy={ true } className={ css.container } { ...props.rawProps }>
            { text.map((it, index) => (
                <span
                    key={ index }
                    dangerouslySetInnerHTML={ { __html: it } }
                    className={ cx([
                        props.cx,
                        css.loadingWord,
                        styles[`color-${props.color || 'night100'}`],
                        !props.isNotAnimated && css.animatedLoading,
                    ]) }
                />
            )) }
        </div>
    );
});
