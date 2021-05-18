import React from 'react';
import { HeroBlock, StartedBlock, QuoteBlock, ContactsBlock, TechnologiesBlock, ProjectsBlock, BenefitsBlock, ExploreBlock,
    AskDevelopersBlock, ReleasesBlock, InfoBlock, TeamBlock } from './';
import { AppFooter, AppHeader, Page } from '../common';
import { FlexCell } from '@epam/promo';
import { analyticsEvents } from "../analyticsEvents";
import { svc } from "../services";

export class LandingPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.pv());
    }
    render() {
        return (
            <Page renderHeader={ () => <AppHeader /> } renderFooter={ () => <AppFooter /> } >
                <FlexCell cx='app' width='100%'>
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