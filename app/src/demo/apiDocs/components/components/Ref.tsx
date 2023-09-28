import React from 'react';
import { Anchor, Text, Tooltip } from '@epam/uui';
import css from './Ref.module.scss';
import { useTsDocsRefs } from '../../dataHooks';
import { TTypeRefShort } from '../../docsGenSharedTypes';

export function Ref(props: { typeRefShort?: TTypeRefShort }) {
    const { typeRefShort } = props;
    const tsDocsRefs = useTsDocsRefs();
    if (!typeRefShort) {
        return null;
    }

    const typeRefLong = tsDocsRefs[typeRefShort];
    const isLinkable = typeRefLong.isPublic;

    if (typeRefLong) {
        const { module, typeName } = typeRefLong;
        let contentNode: React.ReactNode = typeName.nameFull;
        if (module && typeName) {
            const link = { pathname: '/documents', query: { id: typeRefShort } };
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
