import React from 'react';

import { TeamBlock } from './TeamBlock';
import { StartedBlock } from './StartedBlock';
import { QuoteBlock } from './QuoteBlock';
import { ContactsBlock } from './ContactsBlock';
import { TechnologiesBlock } from './TechnologiesBlock';
import { ProjectsBlock } from './ProjectsBlock';
import { BenefitsBlock } from './BenefitsBlock';
import { HeroBlock } from './HeroBlock';
import { ExploreBlock } from './ExploreBlock';
import { AskDevelopersBlock } from './AskDevelopersBlock';
import { InfoBlock } from './InfoBlock';
import { ReleasesBlock } from './ReleasesBlock';
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
            <Page renderHeader={ this.renderHeader } renderFooter={ this.renderFooter }>
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
