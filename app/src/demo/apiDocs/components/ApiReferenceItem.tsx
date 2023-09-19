import React from 'react';
import { useGetTsDocsForPackage } from '../dataHooks';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiReferenceItemTable } from './ApiReferenceItemTable';
import { useSearchParams } from 'react-router-dom';
import { TTsDocExportedEntry } from '../types';

export function ApiReferenceItem() {
    const [params] = useSearchParams();
    const [p1, p2, exportName] = params.get('id').split('/');
    const packageName = `${p1}/${p2}`;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];
    const {
        typeRef,
        typeValue,
        comment,
    } = exportInfo || {};

    if (!exportInfo) {
        return null;
    }

    const items: { title?: string, node: React.ReactNode }[] = [];
    if (comment?.length > 0) {
        items.push({
            title: 'Description',
            node: <TsComment text={ comment } keepBreaks={ true } />,
        });
    }
    const hasProps = exportInfo?.props?.length > 0;
    if (hasProps) {
        const entry = `${packageName}:${exportName}` as TTsDocExportedEntry;
        items.push({
            node: <ApiReferenceItemTable key={ entry } entry={ entry } showCode={ true } />,
        });
    }
    if (!hasProps) {
        items.push({
            node: <Code codeAsHtml={ typeValue.print?.join('\n') } />,
        });
    }

    return (
        <Layout title={ typeRef.typeName.nameFull }>
            {items}
        </Layout>
    );
}
