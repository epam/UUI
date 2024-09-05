import { DocItem } from '../../documents/structure';
import { Sidebar } from '../sidebar';
import React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { TreeListItem } from '@epam/uui-components';
import { useQuery } from '../../helpers';
import { TMode } from './docsConstants';
import { ThemeId } from '../../data';
import { svc } from '../../services';

type DocsQuery = {
    id: string,
    mode?: TMode,
    isSkin?: boolean,
    theme?: ThemeId,
    category?: string
};

const redirectTo = (query: DocsQuery) =>
    svc.uuiRouter.redirect({
        pathname: '/documents',
        query,
    });

export function DocsSidebar() {
    const { docsMenuStructure } = svc.uuiApp;
    const mode = useQuery<DocsQuery['mode']>('mode') || TMode.doc;
    const queryParamId: string = useQuery('id');
    const isSkin = useQuery<DocsQuery['isSkin']>('isSkin');
    const theme = useQuery<DocsQuery['theme']>('theme');

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

    return (
        <Sidebar<DocItem>
            value={ queryParamId }
            onValueChange={ onChange }
            items={ docsMenuStructure }
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
    );
}
