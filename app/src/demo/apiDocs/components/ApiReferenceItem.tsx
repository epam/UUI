import React from 'react';
import { useGetTsDocsForPackage } from '../dataHooks';
import { svc } from '../../../services';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiReferenceItemTable } from './ApiReferenceItemTable';

export function ApiReferenceItem() {
    const { id } = svc.uuiRouter.getCurrentLink().query;
    const [p1, p2, exportName] = id.split('/');
    const packageName = `${p1}/${p2}`;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];
    const {
        typeName,
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
            node: <TsComment text={ comment } keepBreaks={ false } />,
        });
    }
    if (exportInfo?.props?.length > 0) {
        items.push({
            node: <ApiReferenceItemTable packageName={ packageName } exportName={ exportName } />,
        });
    }
    items.push({
        node: <Code codeAsHtml={ typeValue.print?.join('\n') } />,
    });

    return (
        <Layout title={ typeName.nameFull }>
            {items}
        </Layout>
    );
}
