import React, { useEffect } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { UUI4, UUI3 } from '../common';
import { items, DocItem } from './structure';
import { getQuery } from '../helpers';
import { codesandboxService } from '../data/codesandbox/service';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';

type DocsQuery = {
    id: string;
    mode?: string;
    skin?: UUI3 | UUI4;
    category?: string;
};

export const DocumentsPage = () => {
    const redirectTo = (query: DocsQuery) =>
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query,
        });

    if (!items.map((item) => item.id).includes(getQuery('id'))) {
        redirectTo({ id: items[0].id, mode: 'doc', skin: UUI4 });
    }

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

    useEffect(() => {
        codesandboxService.getFiles();
        return () => codesandboxService.clearFiles();
    }, []);

    const PageComponent = items.find((item) => item.id === getQuery('id')).component;

    return (
        <Page renderHeader={() => <AppHeader />}>
            <FlexRow alignItems="stretch">
                <Sidebar<DocItem>
                    value={getQuery('id')}
                    onValueChange={onChange}
                    items={items}
                    getSearchFields={(i) => [i.name, ...(i.tags || [])]}
                    getItemLink={(row) =>
                        !row.isFoldable && {
                            pathname: 'documents',
                            query: {
                                id: row.id,
                                mode: (row.parentId && svc.uuiRouter.getCurrentLink().query.mode) || 'doc',
                                skin: (row.parentId && svc.uuiRouter.getCurrentLink().query.skin) || UUI4,
                                category: row.parentId && row.parentId,
                            },
                        }
                    }
                />
                <PageComponent />
            </FlexRow>
        </Page>
    );
};
