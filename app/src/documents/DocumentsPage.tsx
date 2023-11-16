import React, { useEffect, useMemo, useState } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { DocItem, items as itemsStructure } from './structure';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';
import { TypeRefPage } from '../common/apiReference/TypeRefPage';
import { TSkin } from '@epam/uui-docs';

type DocsQuery = {
    id: string;
    mode?: string;
    skin?: TSkin.UUI3_loveship | TSkin.UUI4_promo;
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

function useItems(selectedId: string): { items: DocItem[], PageComponent: any } {
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
    const mode = useQuery('mode') || 'doc';
    const skin = useQuery<DocsQuery['skin']>('skin') || TSkin.UUI4_promo;
    const itemsInfo = useItems(queryParamId);

    useEffect(() => {
        if (itemsInfo && !itemsInfo.PageComponent) {
            redirectTo({ id: itemsInfo.items[0].id, mode: 'doc', skin: TSkin.UUI4_promo });
        }
    }, [itemsInfo]);

    useEffect(() => {
        codesandboxService.getFiles();
        return () => codesandboxService.clearFiles();
    }, []);

    if (!itemsInfo?.PageComponent) {
        return null;
    }
    const { items, PageComponent } = itemsInfo;

    const onChange = (row: DataRowProps<TreeListItem, string>) => {
        if (row.parentId === 'components') {
            redirectTo({
                id: row.id,
                mode,
                skin,
                category: row.parentId,
            });
        } else {
            redirectTo({ id: row.id, category: row.parentId });
        }
    };
    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow alignItems="stretch">
                <Sidebar<DocItem>
                    value={ queryParamId }
                    onValueChange={ onChange }
                    items={ items }
                    getSearchFields={ (i) => [i.name, ...(i.tags || [])] }
                    getItemLink={ (row) =>
                        !row.isFoldable && {
                            pathname: '/documents',
                            query: {
                                id: row.id,
                                mode: (row.parentId && mode) || 'doc',
                                skin: (row.parentId && skin) || TSkin.UUI4_promo,
                                category: row.parentId,
                            },
                        } }
                />
                <PageComponent />
            </FlexRow>
        </Page>
    );
}
