import * as React from 'react';
import { Anchor, FlexRow, FlexSpacer, LinkButton, ScrollBars, TabButton, Text } from '@epam/promo';
import { AppHeader, Page } from '../common';
import { svc } from '../services';
import { demoItems } from './structure';
import { analyticsEvents } from '../analyticsEvents';
import { getQuery } from '../helpers';
import * as css from './DemoPage.scss';
import { ReactComponent as LinkIcon } from '../icons/action-external_link.svg';

export class DemoPage extends React.Component {
    constructor(props: any) {
        super(props);

        const { id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.demo.pv(id));
    }

    componentDidUpdate() {
        const { id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.demo.pv(id));
    }

    sendEvent = (name: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.demo.scenarioSelect(name));
    }

    renderDemoNavigationPage() {
        return (
            <div className={ css.navPage } >
                <div className={ css.navTitle }>Demo</div>
                <div className={ css.navCards }>
                    {
                        demoItems.map((item) => (
                            <Anchor key={ item.id } link={ { pathname: '/demo', query: { id: item.id } } } onClick={ () => this.sendEvent(item.name) } >
                                <div className={ css.navCard } style={ { backgroundImage: `url(${item.previewImage})` } } >
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
            <FlexRow rawProps={{ role: 'tablist' }} background='white' padding='12' cx={ css.secondaryNavigation } borderBottom >
                { demoItems.map(item => {
                    return(
                        <TabButton
                            key={ item.id }
                            size='60'
                            caption={ item.name }
                            isLinkActive={ getQuery('id') === item.id }
                            onClick={ () => svc.uuiRouter.redirect({
                                pathname: '/demo',
                                query: { id: item.id },
                            }) }
                        />
                    );
                }) }
                <FlexSpacer />
                <LinkButton icon={ LinkIcon } caption='View Source Code' target='_blank' href={ source } cx={ css.sourceLink } clickAnalyticsEvent={ analyticsEvents.demo.scenarioGit(source) } />
            </FlexRow>
        );
    }

    renderDemoComponent() {
        const selectedDemoId = getQuery('id');
        const demo = demoItems.find(i => i.id === selectedDemoId);

        return (
            <>
                { this.renderSecondaryMenu(demo.source) }
                <ScrollBars> { React.createElement(demo.component) } </ScrollBars>
            </>
        );
    }

    render() {
        const selectedDemoId = getQuery('id');

        return (
            <Page contentCx={ css.root } renderHeader={ () => <AppHeader /> }>
                { selectedDemoId ? this.renderDemoComponent() : this.renderDemoNavigationPage() }
            </Page>
        );
    }
}