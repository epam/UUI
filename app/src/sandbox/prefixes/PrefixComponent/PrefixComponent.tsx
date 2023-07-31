import React from 'react';
import css from './PrefixComponent.module.scss';

interface TestComponentProps {
    text: string;
}

export default function PrefixComponent(props: TestComponentProps) {
    return (
        <div className={ css.prefixWrapper }>
            {props.text}
        </div>
    );
}
