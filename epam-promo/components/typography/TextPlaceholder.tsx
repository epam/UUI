import * as React from 'react';
import * as css from './TextPlaceholder.scss';
import cx from 'classnames';

export interface TextPlaceholderProps {
    wordsCount?: number;
    color?: 'gray10' | 'gray40';
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
                css.loadingWord,
                css['text-placeholder-color-' + (props.color || 'gray40')],
                !props.isNotAnimated && css.animatedLoading,
            ]) }
        >
            { text }
        </span>
    );
}
