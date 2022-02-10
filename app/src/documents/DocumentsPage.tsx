import React, { useEffect } from 'react';
import { TreeNodeProps } from '@epam/uui-components';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { UUI4, UUI3 } from '../common';
import { items, DocItem } from './structure';
import { getQuery } from '../helpers';
import { codesandboxService } from '../data/codesandbox/service';

type DocsQuery = {
    id: string,
    mode?: string,
    skin?: UUI3 | UUI4,
    category?: string,
};

export const DocumentsPage = () => {
    const redirectTo = (query: DocsQuery) => svc.uuiRouter.redirect({
        pathname: '/documents',
        query,
    });

    if (!items.map(item => item.id).includes(getQuery('id'))) {
        redirectTo({ id: items[0].id, mode: 'doc', skin: UUI4 })
    }

    const onChange = (val: TreeNodeProps) => {
        if (val.parentId === 'components') {
            redirectTo({ id: val.id, mode: getQuery('mode') || 'doc', skin: getQuery<DocsQuery['skin']>('skin') || UUI4, category: val.parentId });
        } else {
            redirectTo({ id: val.id, category: val.parentId });
        }
    };

    useEffect(() => {
        codesandboxService.getFiles();
        return () => codesandboxService.clearFiles();
    }, []);

    return (
        <Page renderHeader={ () => <AppHeader /> } >
            <FlexRow alignItems='stretch'>
                <Sidebar<DocItem>
                    value={ getQuery('id') }
                    onValueChange={ onChange }
                    items={ items }
                    getItemLink={ (item) => !item.isDropdown && {
                        pathname: 'documents',
                        query: {
                            id: item.id,
                            mode: item.parentId && svc.uuiRouter.getCurrentLink().query.mode || 'doc',
                            skin: item.parentId && svc.uuiRouter.getCurrentLink().query.skin || UUI4,
                            category: item.parentId && item.parentId,
                        },
                    } }
                />
                { React.createElement(items.find(item => item.id === getQuery('id')).component) }
            </FlexRow>
        </Page>
    );
};