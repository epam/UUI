import React, { useMemo, createElement } from 'react';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { getQuery } from '../helpers';
import { ComplexForm } from './forms/ComplexForm';
import { DbDemo } from './db/DbDemo';
import { PersonsTableDemo } from './tables/PersonsTableDemo';
import { DemoTablePaged } from './tablePaged';
import { FilteredTable } from './filteredTable/FilteredTable';
import { DraftRTEDemo } from './draft-rte/DraftRTEDemo';
import { ScrollSpyDemo } from './scroll-spy/ScrollSpyDemo';
import { Responsive } from './responsive/Responsive';
import { ThemeDemo } from './theme/ThemeDemo';
import { ProductsTableDemo } from './productsTable/ProductsTableDemo';
import { ProjectDemo } from './project/ProjectDemo';
import { TreeListItem } from 'uui-components';
import { DataRowProps } from 'uui-core';

export const SandboxPage = () => {
    const items = useMemo(() => [
        { id: 'complexForm', name: 'Complex Form', component: ComplexForm },
        { id: 'dbDemo', name: 'DB demo', component: DbDemo },
        { id: 'tableDemo', name: 'Persons Table', component: PersonsTableDemo },
        { id: 'productsTableDemo', name: 'Products Table', component: ProductsTableDemo },
        { id: 'projectDemo', name: 'Project Table', component: ProjectDemo },
        { id: 'Draft', name: 'DRAFT RTE demo', component: DraftRTEDemo },
        { id: 'scrollSpy', name: 'Scroll Spy', component: ScrollSpyDemo },
        { id: 'responsive', name: 'Responsive', component: Responsive },
        { id: 'uui-v_theming', name: 'UUI-V Theming', component: ThemeDemo },
        { id: 'DemoTablePaged', name: 'Table with paging', component: DemoTablePaged },
        { id: 'DemoWithFilters', name: 'Table with filters', component: FilteredTable },
    ], []);

    if (!items.map(item => item.id).includes(getQuery('id'))) {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
    }

    const onChange = (val: DataRowProps<TreeListItem, string>) => {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: val.id } });
    };

    return (
        <Page renderHeader={ () => <AppHeader /> } >
            <FlexRow alignItems='stretch' rawProps={ { style: { height: 'calc(100vh - 60px)' } } }>
                <Sidebar
                    value={ getQuery('id') }
                    onValueChange={ onChange }
                    getItemLink={ (item) => !item.isFoldable && {
                        pathname: 'sandbox',
                        query: { id: item.id },
                    } }
                    items={ items }
                />
                { createElement(items.find(item => item.id === getQuery('id')).component) }
            </FlexRow>
        </Page>
    );
};