import React, { useEffect, useMemo } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { UUI4Type, UUI3Type, UUI4 } from '../common';
import { items as itemsStructure, DocItem } from './structure';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps, useUuiContext } from '@epam/uui-core';
import { ApiReferenceItem } from '../demo/apiDocs/components/ApiReferenceItem';
import { TApi, TAppContext } from '../data';

type DocsQuery = {
    id: string;
    mode?: string;
    skin?: UUI4Type | UUI3Type;
    category?: string;
};

function useApiReferenceNav(): DocItem[] | undefined {
    const { uuiApp } = useUuiContext<TApi, TAppContext>();
    const apiRef = uuiApp.docsApiReference;
    const root = { id: 'ApiReference', name: 'Api Reference' };
    return Object.keys(apiRef).reduce<DocItem[]>((acc, moduleName) => {
        acc.push({ id: moduleName, name: moduleName, parentId: root.id });
        apiRef[moduleName].forEach((eName) => {
            acc.push({ id: `${moduleName}/${eName}`, name: eName, parentId: moduleName, component: ApiReferenceItem });
        });
        return acc;
    }, [root]);
}

function useItems(selectedId: string): { items: DocItem[], PageComponent: any } | undefined {
    const apiRef = useApiReferenceNav();
    const items = useMemo(() => {
        if (apiRef) {
            return itemsStructure.concat(apiRef);
        }
    }, [apiRef]);
    const PageComponent = useMemo(() => {
        if (items) {
            const found = items.find((item) => item.id === selectedId);
            return found?.component;
        }
    }, [items, selectedId]);
    return {
        items,
        PageComponent,
    };
}

const redirectTo = (query: DocsQuery) =>
    svc.uuiRouter.redirect({
        pathname: '/documents',
        query,
    });

export function DocumentsPage() {
    const queryParamId: string = useQuery('id');
    const mode = useQuery('mode') || 'doc';
    const skin = useQuery<DocsQuery['skin']>('skin') || UUI4;
    const { items, PageComponent } = useItems(queryParamId);

    useEffect(() => {
        if (items && !PageComponent) {
            redirectTo({ id: items[0].id, mode: 'doc', skin: UUI4 });
        }
    }, [items, PageComponent]);

    useEffect(() => {
        codesandboxService.getFiles();
        return () => codesandboxService.clearFiles();
    }, []);

    if (!PageComponent) {
        return null;
    }

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
                                skin: (row.parentId && skin) || UUI4,
                                category: row.parentId,
                            },
                        } }
                />
                <PageComponent />
            </FlexRow>
        </Page>
    );
}
