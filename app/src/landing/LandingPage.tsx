import React from 'react';
import { HeroBlock, StartedBlock, QuoteBlock, ContactsBlock, TechnologiesBlock, ProjectsBlock, BenefitsBlock, ExploreBlock,
    AskDevelopersBlock, ReleasesBlock, InfoBlock, TeamBlock } from './';
import { AppFooter, AppHeader, Page } from '../common';
import { FlexCell } from '@epam/promo';

export class LandingPage extends React.Component<any, any> {
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