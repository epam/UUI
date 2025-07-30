import React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { Sidebar } from '../sidebar';
import { useQuery } from '../../helpers';
import { TMode } from './docsConstants';
import { ThemeId, DocItem } from '@epam/uui-docs';
import { svc } from '../../services';
import { useAppThemeContext } from '../../helpers/appTheme';

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
    const { theme } = useAppThemeContext();

    const onChange = (row: DataRowProps<DocItem, string>) => {
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

    const getSearchFields = (item: DocItem) => {
        if (item.examples || item.component || item.renderContent) {
            return [item.name, ...(item.tags || [])];
        }
        return [];
    };

    return (
        <Sidebar
            value={ queryParamId }
            onValueChange={ onChange }
            items={ docsMenuStructure }
            getSearchFields={ getSearchFields }
            getItemLink={ (item) => ({
                pathname: '/documents',
                query: {
                    id: item.id,
                    mode: mode,
                    isSkin: isSkin,
                    category: item.parentId,
                    theme,
                },
            }) }
        />
    );
}
