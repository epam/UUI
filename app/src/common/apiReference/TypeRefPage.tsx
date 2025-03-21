import React, { useEffect } from 'react';
import { useDocsGenForType } from './dataHooks';
import { Code } from '../docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { useSearchParams } from 'react-router-dom';
import { TDocsGenExportedType } from '@epam/uui-docs';
import { TTypeRef } from '@epam/uui-docs';
import { TypeRefSection } from './TypeRefSection';

export function TypeRefPage() {
    const [params] = useSearchParams();
    const typeRefShort = params?.get('id') as TTypeRef;
    const docsGenType = useDocsGenForType(typeRefShort);

    const items: { title?: string, node: React.ReactNode }[] = [];
    const comment = docsGenType?.summary?.comment;
    const title = docsGenType?.summary?.typeName.nameFull;

    if (comment?.raw?.length) {
        items.push({
            title: 'Description',
            node: <TsComment comment={ comment } keepBreaks={ true } />,
        });
    }

    if (docsGenType?.details) {
        const hasProps = docsGenType.details.props?.length;
        if (hasProps) {
            const entry = typeRefShort as TDocsGenExportedType;
            items.push({
                node: <TypeRefSection key={ entry } typeRef={ entry } showCode={ true } />,
            });
        }
        if (!hasProps) {
            items.push({
                node: <Code codeAsHtml={ docsGenType.details.typeValue?.print?.join('\n') || '' } />,
            });
        }
    }

    useEffect(() => {
        document.title = title ? `${title} | UUI` : 'UUI';
    }, [title]);

    return (
        <Layout title={ title }>
            {items}
        </Layout>
    );
}
