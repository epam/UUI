import React from 'react';
import './PrefixComponent.scss';

interface TestComponentProps {
    text: string;
}

export default function PrefixComponent(props: TestComponentProps) {
    return (
        <div className="prefixWrapper">
            {props.text}
        </div>
    );
}
