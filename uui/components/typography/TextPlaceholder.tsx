import * as React from 'react';
import cx from 'classnames';
import css from './TextPlaceholder.scss';
import '../../assets/styles/variables/typography/textPlaceholder.scss';

export interface TextPlaceholderProps {
    wordsCount?: number;
    isNotAnimated?: boolean;
}

export const TextPlaceholder: React.FunctionComponent<TextPlaceholderProps> = (props) => {
    const pattern = `0`;
    const text = React.useMemo(() => {
        const words = [];
        for (let i = 0; i < (props.wordsCount || 1); i++) {
            let lengthWord = Math.floor(Math.random() * 10 + 8);
            words.push(pattern.repeat(lengthWord));
        }
        return words;
    }, [props.wordsCount]);

    return (
        <div aria-busy={ true } className={ css.container }>{
            text.map((it: string, index: number) => (
                <span
                    key={ index }
                    className={ cx([
                        'text-placeholder-vars',
                        css.loadingWord,
                        !props.isNotAnimated && css.animatedLoading,
                    ]) }
                    dangerouslySetInnerHTML={ {__html: it} }
                />
            )) }
        </div>
    );
};
