import { TRef } from '../../types';
import React from 'react';
import { Anchor, Text } from '@epam/uui';
import css from './Ref.module.scss';

export function Ref(props: { refData: TRef }) {
    const { refData } = props;

    if (refData) {
        const { module, name } = refData;
        let contentNode: React.ReactNode = name;
        if (module && name) {
            const link = { pathname: '/documents', query: { id: `${module}/${name}` } };
            contentNode = (
                <>
                    <Anchor link={ link }>{name}</Anchor>
                    <span className={ css.moduleName }>
                        {`${module}`}
                    </span>
                </>
            );
        }
        return (
            <Text key={ name } cx={ css.root }>
                { contentNode }
            </Text>
        );
    }
    return null;
}
