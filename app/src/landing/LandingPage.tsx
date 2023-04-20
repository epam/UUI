import React from 'react';
import {
    HeroBlock,
    StartedBlock,
    QuoteBlock,
    ContactsBlock,
    TechnologiesBlock,
    ProjectsBlock,
    BenefitsBlock,
    ExploreBlock,
    AskDevelopersBlock,
    ReleasesBlock,
    InfoBlock,
    TeamBlock,
} from './';
import { AppFooter, AppHeader, Page } from '../common';
import { FlexCell } from '@epam/promo';
import { analyticsEvents } from '../analyticsEvents';
import { svc } from '../services';

export class LandingPage extends React.Component {
    constructor(props: {}) {
        super(props);
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.pv());
    }

    renderHeader = () => {
        return <AppHeader />;
    };

    renderFooter = () => {
        return <AppFooter />;
    };

    render() {
        return (
            <Page renderHeader={this.renderHeader} renderFooter={this.renderFooter}>
                <FlexCell cx="app" width="100%">
                    <HeroBlock />
                    <StartedBlock />
                    <QuoteBlock />
                    <InfoBlock />
                    <BenefitsBlock />
                    <ExploreBlock />
                    <ProjectsBlock />
                    <AskDevelopersBlock />
                    <ReleasesBlock />
                    <TeamBlock />
                    <ContactsBlock />
                    <TechnologiesBlock />
                </FlexCell>
            </Page>
        );
    }
}
