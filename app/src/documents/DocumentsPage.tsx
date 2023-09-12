import React, { useEffect, useMemo } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { UUI4Type, UUI3Type, UUI4 } from '../common';
import { items as itemsStructure, DocItem } from './structure';
import { getQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps, useUuiContext } from '@epam/uui-core';
import { ApiReferenceItem } from '../demo/docs/components/ApiReferenceItem';
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
const onChange = (row: DataRowProps<TreeListItem, string>) => {
    if (row.parentId === 'components') {
        redirectTo({
            id: row.id,
            mode: getQuery('mode') || 'doc',
            skin: getQuery<DocsQuery['skin']>('skin') || UUI4,
            category: row.parentId,
        });
    } else {
        redirectTo({ id: row.id, category: row.parentId });
    }
};

export function DocumentsPage() {
    const queryParamId: string = getQuery('id');
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
                                mode: (row.parentId && svc.uuiRouter.getCurrentLink().query.mode) || 'doc',
                                skin: (row.parentId && svc.uuiRouter.getCurrentLink().query.skin) || UUI4,
                                category: row.parentId && row.parentId,
                            },
                        } }
                />
                <PageComponent />
            </FlexRow>
        </Page>
    );
}
