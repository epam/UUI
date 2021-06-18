import * as React from 'react';
import { TreeNodeProps } from '@epam/uui-components';
import { FlexRow } from '@epam/promo';
import { AppHeader, Page, Sidebar } from '../common';
import { svc } from '../services';
import { getQuery } from '../helpers';
import { ComplexForm } from './forms/ComplexForm';
import { DbDemo } from './db/DbDemo';
import { PersonsTableDemo } from './tables/PersonsTableDemo';
import { DraftRTEDemo } from './draft-rte/DraftRTEDemo';

import css from "./SandboxPage.scss";

const items = [
    { id: 'complexForm', name: 'Complex Form', component: ComplexForm },
    { id: 'dbDemo', name: 'DB demo', component: DbDemo },
    { id: 'tableDemo', name: 'Table Demo', component: PersonsTableDemo },
    { id: 'Draft', name: 'DRAFT RTE demo', component: DraftRTEDemo },
];

const itemsIds = items.map(i => i.id);

export const SandboxPage = () => {
    if (!itemsIds.includes(getQuery('id'))) {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
    }

    const onChange = (val: TreeNodeProps) => {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: val.id } });
    };

    const selectedExampleId = getQuery('id');
    const example = items.find(i => i.id === selectedExampleId);

    return (
        <Page renderHeader={ () => <AppHeader /> } contentCx={ css.root }>
            <FlexRow alignItems="stretch" cx={ css.root }>
                <Sidebar
                    value={ selectedExampleId }
                    onValueChange={ onChange }
                    getItemLink={ (item) => !item.isDropdown && {
                        pathname: 'sandbox',
                        query: { id: item.id },
                    } }
                    items={ items }
                />
                { React.createElement(example.component) }
            </FlexRow>
        </Page>
    );
};