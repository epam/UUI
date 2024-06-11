import React, { useMemo, createElement } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { getQuery } from '../helpers';
import { DbDemo } from './db/DbDemo';
import { PersonsTableDemo } from './tables/PersonsTableDemo';
import { DemoTablePaged } from './tablePaged';
import { DraftRTEDemo } from './draft-rte/DraftRTEDemo';
import { ScrollSpyDemo } from './scroll-spy/ScrollSpyDemo';
import { Responsive } from './responsive/Responsive';
import { ThemeDemo } from './theme/ThemeDemo';
import { ThemeElectricDemo } from './theme-electric-test/ThemeDemo';
import { ProductsTableDemo } from './productsTable/ProductsTableDemo';
import { AdaptivePanelDemo } from './adaptivePanel/AdaptivePanelDemo';
import { TreeListItem } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';
import { Skills } from './skills';
import TableCellsStylesSandbox from './tableCellStyles/TableCellsStylesSandbox';
import { ProjectTasksDemo } from './tasks/ProjectTasksDemo';
import { RichTextEditorDemo } from './RTE/rteDemo';
import { TableColumnConfigModalTest } from './tableColConfigModal/TableColumnConfigModalTest';
import { PalettePage } from './tokens/palette/palettePage';
import { ReactQueryLocationsTable } from './reactQueryLocationsTable';
import { ProjectTableDemo } from './editableTable';
import { RtlExample } from './rtl/Rtl-example';
import { DemoForm } from './rtl/form/DemoForm';

export function SandboxPage() {
    const items = useMemo(
        () => [
            { id: 'dbDemo', name: 'DB demo', component: DbDemo },
            { id: 'tableDemo', name: 'Persons Table', component: PersonsTableDemo },
            { id: 'productsTableDemo', name: 'Products Table', component: ProductsTableDemo },
            { id: 'projectTasksDemo', name: 'Project Tasks Demo', component: ProjectTasksDemo },
            { id: 'editableTableDemo', name: 'Editable Table', component: ProjectTableDemo },
            { id: 'reactQueryLocationsTableDemo', name: 'React-query Loactions Demo', component: ReactQueryLocationsTable },
            { id: 'Draft', name: 'DRAFT RTE demo', component: DraftRTEDemo },
            { id: 'scrollSpy', name: 'Scroll Spy', component: ScrollSpyDemo },
            { id: 'responsive', name: 'Responsive', component: Responsive },
            { id: 'uui_theming', name: 'UUI Theming', component: ThemeDemo },
            { id: 'theme_electric', name: 'Theme Electric', component: ThemeElectricDemo },
            { id: 'DemoTablePaged', name: 'Table with paging', component: DemoTablePaged },
            { id: 'SkillsBatteryPopover', name: 'Skills', component: Skills },
            { id: 'TableCellsStylesSandbox', name: 'Table Cells/Rows styles', component: TableCellsStylesSandbox },
            { id: 'AdaptivePanel', name: 'Adaptive panel', component: AdaptivePanelDemo },
            { id: 'RTEDemo', name: 'RTE Demo', component: RichTextEditorDemo },
            { id: 'TableColumnsConfigurationModal', name: 'Table ColumnsConfigModal', component: TableColumnConfigModalTest },
            { id: 'tokens', name: 'Tokens' },
            { parentId: 'tokens', id: 'tokensPalette', name: 'Palette', component: PalettePage },
            { id: 'rtl-example', name: 'Rtl-example', component: RtlExample },
            { id: 'rtl-form', name: 'Rtl-Form', component: DemoForm },
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
