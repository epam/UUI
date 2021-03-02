import * as React from 'react';
import { AppHeader, Page, Sidebar } from '../common';
import { TreeNodeProps } from '@epam/uui-components';
import { svc } from '../services';
import { UUI4 } from '../common';
import { items } from './structure';
import { FlexRow } from '@epam/promo';

export class DocumentsPage extends React.Component {
    constructor(props: any) {
        super(props);
        if (!this.getQuery('id')) {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: items[0].id, mode: 'doc', skin: UUI4 } });
        }
    }

    componentWillUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any) {
        if (!this.getQuery('id')) {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: items[0].id, mode: 'doc', skin: UUI4 } });
        }
    }

    onChange = (val: TreeNodeProps) => {
        if (val.parentId === 'components') {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: val.id, mode: this.getQuery('mode') || 'doc', skin: this.getQuery('skin') || UUI4, category: val.parentId } });
        } else {
            svc.uuiRouter.redirect({ pathname: '/documents', query: { id: val.id, category: val.parentId } });
        }
    }

    getQuery(query: string): string {
        return svc.uuiRouter.getCurrentLink().query[query];
    }

    render() {
        const selectedDocId = this.getQuery('id');
        const doc = items.find(i => i.id === selectedDocId);

        return (
            <Page renderHeader={ () => <AppHeader /> } >
                <FlexRow alignItems='stretch'>
                    <Sidebar
                        value={ selectedDocId }
                        onValueChange={ this.onChange }
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
                    { React.createElement(doc.component) }
                </FlexRow>
            </Page>
        );
    }
}