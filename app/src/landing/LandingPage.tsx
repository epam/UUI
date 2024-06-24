import React from 'react';

import { StartedBlock } from './StartedBlock';
import { ContactsBlock } from './ContactsBlock';
import { HeroBlock } from './HeroBlock';
import { ExploreBlock } from './ExploreBlock';
import { ReleasesBlock } from './ReleasesBlock';
import { AppFooter, AppHeader, Page } from '../common';
import { FlexCell } from '@epam/promo';
import { analyticsEvents } from '../analyticsEvents';
import { svc } from '../services';
import { IntroBlock } from './IntroBlock';
import { PatternBlock } from './PatternBlock';

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
                <FlexCell width="100%">
                    <IntroBlock />
                    <PatternBlock />
                    <HeroBlock />
                    <StartedBlock />
                    <ExploreBlock />
                    <ReleasesBlock />
                    <ContactsBlock />
                </FlexCell>
            </Page>
        );
    }
}
