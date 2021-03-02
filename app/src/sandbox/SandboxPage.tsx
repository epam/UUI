import * as React from 'react';
import {AppHeader, Page, Sidebar, UUI4} from '../common';
import { TreeNodeProps } from '@epam/uui-components';
import { svc } from '../services';
import { DbDemo } from "./db/DbDemo";
import { ComplexForm } from "./forms/ComplexForm";
import { FlexRow } from "@epam/promo";
import { PersonsTableDemo } from './tables/PersonsTableDemo';
import { DraftRTEDemo } from './draft-rte/DraftRTEDemo';

const items = [
    { id: 'complexForm', name: 'Complex Form', component: ComplexForm },
    { id: 'dbDemo', name: 'DB demo', component: DbDemo },
    { id: 'tableDemo', name: 'Table Demo', component: PersonsTableDemo },
    { id: 'Draft', name: 'DRAFT RTE demo', component: DraftRTEDemo },
];

export class SandboxPage extends React.Component {
    constructor(props: any) {
        super(props);
        if (!this.getQuery('id')) {
            svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
        }
    }

    componentWillUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any) {
        if (!this.getQuery('id')) {
            svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: items[0].id } });
        }
    }

    onChange = (val: TreeNodeProps) => {
        svc.uuiRouter.redirect({ pathname: '/sandbox', query: { id: val.id } });
    }

    getQuery(query: string): string {
        return svc.uuiRouter.getCurrentLink().query[query];
    }

    render() {
        const selectedExampleId = this.getQuery('id');
        const example = items.find(i => i.id === selectedExampleId);

        return (
            <Page renderHeader={ () => <AppHeader /> } >
                <FlexRow alignItems='stretch'>
                    <Sidebar
                        value={ selectedExampleId }
                        onValueChange={ this.onChange }
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
    }
}