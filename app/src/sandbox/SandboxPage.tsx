import React, { useMemo, createElement } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { getQuery } from '../helpers';
import { DbDemo } from './db/DbDemo';
import { PersonsTableDemo } from './tables/PersonsTableDemo';
import { DemoTablePaged } from './tablePaged';
import { ScrollSpyDemo } from './scroll-spy/ScrollSpyDemo';
import { ThemeDemo } from './theme/ThemeDemo';
import { ThemeElectricDemo } from './theme-electric-test/ThemeDemo';
import { ProductsTableDemo } from './productsTable/ProductsTableDemo';
import { AdaptivePanelDemo } from './adaptivePanel/AdaptivePanelDemo';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';
import { Skills } from './skills';
import { ProjectTasksDemo } from './tasks/ProjectTasksDemo';
import { RichTextEditorDemo } from './RTE/rteDemo';
import { PalettePage } from './tokens/palette/palettePage';
import { ReactQueryLocationsTable } from './reactQueryLocationsTable';
import { ProjectTableDemo } from './editableTable';
import { RtlExample } from './rtl/Rtl-example';
import { DemoForm } from './rtl/form/DemoForm';
import { RichTextEditorDemoReadonly } from './RTE-readonly/RichTextEditorDemo';
import { PerformanceTestPage } from './perfomance-stand/PerformanceTestPage';

export function SandboxPage() {
    const items = useMemo(
        () => [
            { id: 'dbDemo', name: 'DB demo', component: DbDemo },
            { id: 'tableDemo', name: 'Persons Table', component: PersonsTableDemo },
            { id: 'productsTableDemo', name: 'Products Table', component: ProductsTableDemo },
            { id: 'projectTasksDemo', name: 'Project Tasks Demo', component: ProjectTasksDemo },
            { id: 'editableTableDemo', name: 'Editable Table', component: ProjectTableDemo },
            { id: 'reactQueryLocationsTableDemo', name: 'React-query Locations Demo', component: ReactQueryLocationsTable },
            { id: 'scrollSpy', name: 'Scroll Spy', component: ScrollSpyDemo },
            { id: 'uui_theming', name: 'UUI Theming', component: ThemeDemo },
            { id: 'theme_electric', name: 'Theme Electric', component: ThemeElectricDemo },
            { id: 'DemoTablePaged', name: 'Table with paging', component: DemoTablePaged },
            { id: 'SkillsBatteryPopover', name: 'Skills', component: Skills },
            { id: 'AdaptivePanel', name: 'Adaptive panel', component: AdaptivePanelDemo },
            { id: 'RTEDemo', name: 'RTE Contents', component: RichTextEditorDemo },
            { id: 'RTE-readonly', name: 'RTE Readonly', component: RichTextEditorDemoReadonly },
            { id: 'tokens', name: 'Tokens' },
            { parentId: 'tokens', id: 'tokensPalette', name: 'Palette', component: PalettePage },
            { id: 'rtl-example', name: 'Rtl-example', component: RtlExample },
            { id: 'rtl-form', name: 'Rtl-Form', component: DemoForm },
            { id: 'performanceStand', name: 'Performance stand', component: PerformanceTestPage },
        ],
        [],
    );

    if (!items.map((item) => item.id).includes(getQuery('id'))) {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
    }

    const onChange = (val: DataRowProps<TreeListItem, string>) => {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: val.id } });
    };

    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow alignItems="stretch" rawProps={ { style: { minHeight: 'calc(100vh - 60px)' } } }>
                <Sidebar
                    value={ getQuery('id') }
                    onValueChange={ onChange }
                    getItemLink={ (item) =>
                        !item.isFoldable && {
                            pathname: 'sandbox',
                            query: { id: item.id },
                        } }
                    items={ items }
                />
                {createElement(items.find((item) => item.id === getQuery('id')).component)}
            </FlexRow>
        </Page>
    );
}
