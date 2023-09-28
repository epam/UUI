import React from 'react';
import { useTsDocForType, useTsDocsRefs } from '../dataHooks';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiReferenceItemTableForTypeRef } from './ApiReferenceItemTable';
import { useSearchParams } from 'react-router-dom';
import { TTsDocExportedEntry } from '../types';
import { TTypeRefShort } from '../docsGenSharedTypes';

export function ApiReferenceItem() {
    const [params] = useSearchParams();
    const typeRefShort = params?.get('id') as TTypeRefShort;
    const tsDocsType = useTsDocForType(typeRefShort);
    const tsDocsRefs = useTsDocsRefs();

    const {
        typeValue,
    } = tsDocsType || {};

    const items: { title?: string, node: React.ReactNode }[] = [];
    const comment = tsDocsRefs[typeRefShort]?.comment;
    if (comment?.length) {
        items.push({
            title: 'Description',
            node: <TsComment text={ comment } keepBreaks={ true } />,
        });
    }
    const hasProps = !!tsDocsType?.props?.length;
    if (hasProps) {
        const entry = typeRefShort as TTsDocExportedEntry;
        items.push({
            node: <ApiReferenceItemTableForTypeRef key={ entry } tsDocsRef={ entry } showCode={ true } />,
        });
    }
    if (!hasProps) {
        items.push({
            node: <Code codeAsHtml={ typeValue?.print?.join('\n') || '' } />,
        });
    }
    const title = tsDocsRefs[typeRefShort]?.typeName.nameFull;
    return (
        <Layout title={ title }>
            {items}
        </Layout>
    );
}
