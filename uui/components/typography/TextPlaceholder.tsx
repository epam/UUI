import * as React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps, isFontAvailable } from '@epam/uui-core';
import css from './TextPlaceholder.module.scss';
import { PropsWithChildren } from 'react';

export interface ITextPlaceholderProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasCX {
    /** Number of placeholder worlds to render in block */
    wordsCount?: number;
    /** Pass true, to turn off the placeholder animation */
    isNotAnimated?: boolean;
}

export type TextPlaceholderProps = PropsWithChildren<ITextPlaceholderProps>;

export const TextPlaceholder: React.FunctionComponent<PropsWithChildren<ITextPlaceholderProps>> = (props) => {
    const [isFontFailed, setIsFontFailed] = React.useState(false);

    const pattern = 'x';
    const text = React.useMemo(() => {
        const words = [];
        for (let i = 0; i < (props.wordsCount || 1); i++) {
            const lengthWord = Math.floor(Math.random() * 10 + 8);
            words.push(pattern.repeat(lengthWord));
        }
        return words;
    }, [props.wordsCount]);

    React.useEffect(() => {
        isFontAvailable('1em Redacted').then((isAvailable) => setIsFontFailed(!isAvailable));
    }, []);

    return (
        <div aria-busy={ true } aria-hidden="true" className={ cx(css.root, 'uui-text-placeholder') } { ...props.rawProps }>
            {text.map((it: string, index: number) => (
                <span
                    key={ index }
                    className={ cx([
                        props.cx, css.loadingWord, !props.isNotAnimated && css.animatedLoading, isFontFailed && css.fontFailed,
                    ]) }
                >
                    {it}
                </span>
            ))}
        </div>
    );
};
