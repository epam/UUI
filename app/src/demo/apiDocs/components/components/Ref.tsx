import { TTypeRef } from '../../types';
import React from 'react';
import { Anchor, Text, Tooltip } from '@epam/uui';
import css from './Ref.module.scss';
import { useTsDocs } from '../../dataHooks';

export function Ref(props: { refData?: TTypeRef }) {
    const { refData } = props;
    const tsDocs = useTsDocs();
    const isLinkable = !!tsDocs.get(refData?.module, refData?.typeName?.name);

    if (refData) {
        const { module, typeName } = refData;
        let contentNode: React.ReactNode = typeName.nameFull;
        if (module && typeName) {
            const link = { pathname: '/documents', query: { id: `${module}/${typeName.name}` } };
            contentNode = (
                <>
                    { isLinkable && <Anchor link={ link }>{typeName.nameFull}</Anchor> }
                    { !isLinkable && <Tooltip content="This type isn't exported"><span>{typeName.nameFull}</span></Tooltip> }
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
