import React from 'react';
import { useTsDocs } from '../dataHooks';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiReferenceItemTable } from './ApiReferenceItemTable';
import { useSearchParams } from 'react-router-dom';
import { TTsDocExportedEntry } from '../types';
import { TTypeRefShort } from '../docsGenSharedTypes';
import { Text } from '@epam/uui';

export function ApiReferenceItem() {
    const [params] = useSearchParams();
    const typeRefShort = params?.get('id') as TTypeRefShort;
    const tsDocs = useTsDocs();
    if (!tsDocs) {
        return null;
    }
    const exportInfo = tsDocs.get(typeRefShort);
    if (!exportInfo) {
        return <Text>{`Unable to find exported type: ${typeRefShort}`}</Text>;
    }
    const {
        typeValue,
        comment,
    } = exportInfo;

    const items: { title?: string, node: React.ReactNode }[] = [];
    if (comment?.length) {
        items.push({
            title: 'Description',
            node: <TsComment text={ comment } keepBreaks={ true } />,
        });
    }
    const hasProps = !!exportInfo?.props?.length;
    if (hasProps) {
        const entry = typeRefShort as TTsDocExportedEntry;
        items.push({
            node: <ApiReferenceItemTable key={ entry } entry={ entry } showCode={ true } />,
        });
    }
    if (!hasProps) {
        items.push({
            node: <Code codeAsHtml={ typeValue?.print?.join('\n') || '' } />,
        });
    }
    const typeRefLong = tsDocs.getTypeRef(exportInfo.typeRef);
    return (
        <Layout title={ typeRefLong?.typeName.nameFull }>
            {items}
        </Layout>
    );
}
