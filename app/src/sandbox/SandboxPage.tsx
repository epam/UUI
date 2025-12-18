import React, { useMemo, createElement } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { getQuery } from '../helpers';
import { DbDemo } from './db/DbDemo';
import { ThemeElectricDemo } from './theme-electric-test/ThemeDemo';
import { DataRowProps } from '@epam/uui-core';
import { Skills } from './skills';
import { PalettePage } from './tokens/palette/palettePage';
import { ReactQueryLocationsTable } from './reactQueryLocationsTable';
import { PerformanceTestPage } from './perfomance-stand/PerformanceTestPage';
import type { DocItem } from '@epam/uui-docs';

export function SandboxPage() {
    const items = useMemo(
        () => [
            { id: 'dbDemo', name: 'DB demo', component: DbDemo },
            { id: 'reactQueryLocationsTableDemo', name: 'React-query Locations Demo', component: ReactQueryLocationsTable },
            { id: 'theme_electric', name: 'Theme Electric', component: ThemeElectricDemo },
            { id: 'SkillsBatteryPopover', name: 'Skills', component: Skills },
            { id: 'tokensPalette', name: 'Theme tokens diff', component: PalettePage },
            { id: 'performanceStand', name: 'Performance stand', component: PerformanceTestPage },
        ],
        [],
    );

    if (!items.map((item) => item.id).includes(getQuery('id'))) {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
    }

    const onChange = (val: DataRowProps<DocItem, string>) => {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: val.id } });
    };

    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow alignItems="stretch" rawProps={ { style: { minHeight: 'calc(100vh - 60px)' } } }>
                <Sidebar
                    value={ getQuery('id') }
                    onValueChange={ onChange }
                    getItemLink={ (item) => ({
                        pathname: 'sandbox',
                        query: { id: item.id },
                    }) }
                    items={ items }
                />
                {createElement(items.find((item) => item.id === getQuery('id')).component)}
            </FlexRow>
        </Page>
    );
}
