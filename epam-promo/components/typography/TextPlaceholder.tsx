import * as React from 'react';
import * as css from './TextPlaceholder.scss';
import { cx } from '@epam/uui';

export interface TextPlaceholderProps {
    wordsCount?: number;
    color?: 'gray10' | 'gray40';
    isNotAnimated?: boolean;
}

export const TextPlaceholder: React.FC<TextPlaceholderProps> = (props) => {
    const text = React.useMemo(() => {
        const pattern = `0`;
        const words = [];
        for (let i = 0; i < (props.wordsCount || 1); i++) {
            const lengthWord = Math.floor(Math.random() * 10 + 8);
            words.push(pattern.repeat(lengthWord));
        }
        return words;
    }, [props.wordsCount]);

    return (
        <div aria-busy={ true } className={ css.container }>
            { text.map((it, index)=> (
                <span
                    key={index}
                    className={ cx([
                        css.loadingWord,
                        css['text-placeholder-color-' + (props.color || 'gray40')],
                        !props.isNotAnimated && css.animatedLoading,
                    ]) }
                    dangerouslySetInnerHTML={{ __html: it }}
                />
            )) }
        </div>
    );
}
