import * as React from 'react';
import { cx } from '@epam/uui';
import {Anchor, FlexRow, FlexSpacer, LinkButton, ScrollBars, TabButton, Text} from '@epam/promo';
import { AppHeader, Page } from '../common';
import { svc } from '../services';
import { demoItems } from './structure';
import * as css from './DemoPage.scss';
import * as linkIcon from '../icons/action-external_link.svg';
import { analyticsEvents } from "../analyticsEvents";

export class DemoPage extends React.Component {
    getQuery(query: string): string {
        return svc.uuiRouter.getCurrentLink().query[query];
    }

    sendEvent = (name: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.demo.scenarioSelect(name));
    }

    renderNavPage() {
        return (
            <div className={ css.navPage } >
                <div className={ css.navTitle }>Demo</div>
                <div className={ css.navCards }>
                    {
                        demoItems.map((item) => (
                            <Anchor key={ item.id } link={ { pathname: '/demo', query: { id: item.id } } } onClick={ () => this.sendEvent(item.name) } >
                                <div className={ cx(css.navCard, css[`${ item.id }-card`]) } >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.navCaption } >{ item.name }</Text>
                                </div>
                            </Anchor>
                        ))
                    }
                </div>
            </div>
        );
    }

    renderSecondaryMenu(source: string) {
        return (
            <FlexRow background='white' padding='12' cx={ css.secondaryNavigation } borderBottom >
                { demoItems.map(item => {
                    return(
                        <TabButton
                            key={ item.id }
                            size='60'
                            caption={ item.name }
                            isLinkActive={ this.getQuery('id') === item.id }
                            onClick={ () => svc.uuiRouter.redirect({
                                pathname: '/demo',
                                query: { id: item.id },
                            }) }
                        />
                    );
                }) }
                <FlexSpacer />
                <LinkButton icon={ linkIcon } caption='View Source Code' target='_blank' href={ source } cx={ css.sourceLink } />
            </FlexRow>
        );
    }

    render() {
        const selectedDemoId = this.getQuery('id');
        const demo = demoItems.find(i => i.id === selectedDemoId);

        return (
            <Page contentCx={ css.root } renderHeader={ () => <AppHeader /> }>
                { selectedDemoId && this.renderSecondaryMenu(demo.source) }
                { selectedDemoId !== 'table'
                    ? <ScrollBars children={ this.getQuery('id') ? React.createElement(demo.component) : this.renderNavPage() } />
                    : React.createElement(demo.component) }
            </Page>
        );
    }
}