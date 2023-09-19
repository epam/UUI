import { TTypeRef } from '../../types';
import React from 'react';
import { Anchor, Text } from '@epam/uui';
import css from './Ref.module.scss';

export function Ref(props: { refData?: TTypeRef }) {
    const { refData } = props;

    if (refData) {
        const { module, typeName } = refData;
        let contentNode: React.ReactNode = typeName.nameFull;
        if (module && typeName) {
            const link = { pathname: '/documents', query: { id: `${module}/${typeName.name}` } };
            contentNode = (
                <>
                    <Anchor link={ link }>{typeName.nameFull}</Anchor>
                    <span className={ css.moduleName }>
                        {`${module}`}
                    </span>
                </>
            );
        }
        return (
            <Text key={ typeName.name } cx={ css.root }>
                { contentNode }
            </Text>
        );
    }
    return null;
}
