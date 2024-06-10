import React, { useEffect, useMemo, useState } from 'react';
import { DataRowProps } from '@epam/uui-core';
import { TreeListItem } from '@epam/uui-components';
import { FlexRow } from '@epam/uui';
import { AppHeader, Page, Sidebar, TypeRefPage } from '../common';
import { svc } from '../services';
import { DocItem, items as itemsStructure } from './structure';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TMode } from '../common/docs/docsConstants';

type DocsQuery = {
    id: string;
    mode?: TMode;
    isSkin?: boolean;
    theme?: string;
    category?: string;
};

async function loadApiReferenceStructure(): Promise<DocItem[]> {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const { content: navigation } = await svc.api.getDocsGenExports();
    const root = { id: 'ApiReference', name: 'Api Reference' };
    return Object.keys(navigation).reduce<DocItem[]>((acc, moduleName) => {
        acc.push({ id: moduleName, name: moduleName, parentId: root.id });
        navigation[moduleName].forEach((exportName) => {
            acc.push({ id: `${moduleName}:${exportName}`, name: exportName, parentId: moduleName, component: TypeRefPage });
        });
        return acc;
    }, [root]);
}

function useItems(selectedId: string) {
    const [apiRefItems, setApiRefItems] = useState<DocItem[]>();

    useEffect(() => {
        loadApiReferenceStructure().then((res) => {
            setApiRefItems(res);
        });
    }, []);

    return useMemo(() => {
        if (apiRefItems) {
            const items = itemsStructure.concat(apiRefItems);
            const PageComponent = items.find((item) => item.id === selectedId)?.component;
            return {
                items,
                PageComponent,
            };
        }
    }, [apiRefItems, selectedId]);
}

const redirectTo = (query: DocsQuery) =>
    svc.uuiRouter.redirect({
        pathname: '/documents',
        query,
    });

export function DocumentsPage() {
    const queryParamId: string = useQuery('id');
    const mode = useQuery<DocsQuery['mode']>('mode') || TMode.doc;
    const isSkin = useQuery<DocsQuery['isSkin']>('isSkin');
    const theme = useQuery<DocsQuery['theme']>('theme');
    const itemsInfo = useItems(queryParamId);

    useEffect(() => {
        if (itemsInfo && !itemsInfo.PageComponent) {
            redirectTo({ id: itemsInfo.items[0].id, mode: TMode.doc, isSkin: isSkin, theme: theme });
        }
    }, [itemsInfo]);

    useEffect(() => {
        codesandboxService.getFiles();
        return () => codesandboxService.clearFiles();
    }, []);

    const onChange = (row: DataRowProps<TreeListItem, string>) => {
        if (row.parentId === 'components') {
            redirectTo({
                category: row.parentId,
                mode,
                id: row.id,
                isSkin,
                theme,
            });
        } else {
            redirectTo({ id: row.id, category: row.parentId });
        }
    };

    const PageComponent = itemsInfo?.PageComponent;

    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow alignItems="stretch">
                <Sidebar<DocItem>
                    value={ queryParamId }
                    onValueChange={ onChange }
                    items={ itemsInfo?.items }
                    getSearchFields={ (i) => [i.name, ...(i.tags || [])] }
                    getItemLink={ (row) =>
                        !row.isFoldable && {
                            pathname: '/documents',
                            query: {
                                id: row.id,
                                mode: (row.parentId && mode),
                                isSkin: (row.parentId && isSkin),
                                category: row.parentId,
                            },
                        } }
                />
                { PageComponent && <PageComponent /> }
            </FlexRow>
        </Page>
    );
}
