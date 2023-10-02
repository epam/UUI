import React from 'react';
import { Anchor, Text, Tooltip } from '@epam/uui';
import css from './Ref.module.scss';
import { useDocsGenSummaries } from '../../dataHooks';
import { TTypeRef } from '../../sharedTypes';

export function Ref(props: { typeRefShort?: TTypeRef }) {
    const { typeRefShort } = props;
    const docsGenSum = useDocsGenSummaries();
    if (!typeRefShort) {
        return null;
    }

    const { exported: isLinkable, module, typeName } = docsGenSum[typeRefShort];

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
