import { TResolvedValueNorm } from '../../types/sharedTypes';
import { IconContainer } from '@epam/uui-components';
import React from 'react';
import { ReactComponent as ArrowLeft } from '@epam/assets/icons/common/navigation-back-12.svg';

import css from './aliasChain.module.scss';

export function AliasChain(props: { resolved: TResolvedValueNorm }) {
    const { resolved } = props;
    const renderArrow = () => {
        return (
            <IconContainer icon={ ArrowLeft } size={ 14 } rotate="90cw" style={ { fill: 'var(--uui-text)' } } />
        );
    };
    const renderBlock = (txt: string) => {
        return (
            <div>
                {txt}
            </div>
        );
    };

    const arrStr = resolved.alias.map((item) => {
        const { id, cssVarSupport } = item;
        const supported = cssVarSupport !== 'notSupported';
        return `${id}${supported ? ` (css: ${item.cssVar})` : ''}`;
    });
    arrStr.push(String(resolved.value));
    arrStr.reverse();

    return (
        <div className={ css.root }>
            {
                arrStr.map((txt, i) => {
                    const b = renderBlock(txt);
                    const arr = i !== arrStr.length - 1 ? renderArrow() : null;
                    return (
                        <React.Fragment key={ i }>
                            {b}
                            {arr}
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
}
