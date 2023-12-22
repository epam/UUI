import { Text } from '@epam/uui';
import React from 'react';
import css from './truncText.module.scss';
import cx from 'classnames';

export function TruncText(props: { text: string }) {
    return (
        <span
            className={ cx(css.root) }
            title={ props.text }
        >
            <Text color="primary">
                {props.text}
            </Text>
        </span>
    );
}
