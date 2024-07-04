import React from 'react';
import { AppFooter, AppHeader, Page } from '../common';
import { FlexCell } from '@epam/promo';
import { analyticsEvents } from '../analyticsEvents';
import { svc } from '../services';
import { IntroBlock } from './IntroBlock';
import { PatternBlock } from './PatternBlock';
import { ExploreBenefitsBlock } from './ExploreBenefitsBlock';
import { FaqBlock } from './FaqBlock';

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
                <FlexCell cx="landing" width="100%">
                    <IntroBlock />
                    <ExploreBenefitsBlock />
                    <PatternBlock />
                    <FaqBlock />
                </FlexCell>
            </Page>
        );
    }
}
