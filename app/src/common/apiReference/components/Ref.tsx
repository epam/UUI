import React from 'react';
import { Anchor, Text, Tooltip } from '@epam/uui';
import css from './Ref.module.scss';
import { TTypeSummary } from '@epam/uui-docs';

export function Ref(props: { typeSummary?: TTypeSummary }) {
    const { typeSummary } = props;
    if (!typeSummary) {
        return null;
    }

    const { exported: isLinkable, module, typeName } = typeSummary;

    let contentNode: React.ReactNode = typeName.nameFull;
    if (module && typeName) {
        const typeRefShort = `${module}:${typeName.name}`;
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
