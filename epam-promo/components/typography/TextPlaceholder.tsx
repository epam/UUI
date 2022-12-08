import * as React from 'react';
import css from './TextPlaceholder.scss';
import cx from 'classnames';
import { PropsWithChildren } from 'react';
import { IHasRawProps } from "@epam/uui-core";

export interface TextPlaceholderProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Number of fake 'words to show */
    wordsCount?: number;
    /** Placeholder's color */
    color?: 'gray10' | 'gray40';
    /** Disables animation */
    isNotAnimated?: boolean;
}

export const TextPlaceholder: React.FunctionComponent<PropsWithChildren<TextPlaceholderProps>> = (props) => {
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
        <div aria-busy={ true } className={ css.container } { ...props.rawProps }>{
            text.map((it: string, index: number) => (
                <span
                    key={ index }
                    className={ cx([
                        css.loadingWord,
                        css['text-placeholder-color-' + (props.color || 'gray40')],
                        !props.isNotAnimated && css.animatedLoading,
                    ]) }
                    dangerouslySetInnerHTML={ {__html: it} }
                />
            )) }
        </div>
    );
};
