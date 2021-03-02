import React from 'react';
import * as css from './TextPlaceholder.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import * as types from '../types';
import cx from 'classnames';
import { IHasCX } from '@epam/uui';

export interface TextPlaceholderProps extends IHasCX {
    wordsCount?: number;
    color?: types.EpamColor;
    isNotAnimated?: boolean;
}

export const TextPlaceholder: React.FunctionComponent<TextPlaceholderProps> = (props) => {
    const pattern = '0';
    let text = React.useMemo(() => {
        const words = [];
        for (let i = 0; i < (props.wordsCount || 1); i++) {
            let lengthWord = Math.floor(Math.random() * 10 + 8);
            words.push(pattern.repeat(lengthWord));
        }
        return words.join(' ')
    }, [props.wordsCount]);

    return (
        <span
            className={ cx([
                props.cx,
                css.loadingWord,
                styles['color-' + (props.color || 'night100')],
                !props.isNotAnimated && css.animatedLoading,
            ]) }
        >
            { text }
        </span>
    );
}
