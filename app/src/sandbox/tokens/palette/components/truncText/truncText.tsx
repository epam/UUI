import { Text } from '@epam/uui';
import React from 'react';
import css from './truncText.module.scss';
import cx from 'classnames';

export function TruncText(props: { text: string | undefined }) {
    const { text = '' } = props;
    return (
        <span
            className={ cx(css.root) }
            title={ text }
        >
            <Text color="primary">
                {text}
            </Text>
        </span>
    );
}
