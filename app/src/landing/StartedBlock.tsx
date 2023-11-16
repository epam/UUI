import * as React from 'react';
import {
    Button, FlexRow, IconContainer, RichTextView, Text,
} from '@epam/promo';
import css from './StartedBlock.module.scss';
import { ReactComponent as CrystalIcon } from '../icons/crystal.svg';
import { ReactComponent as ReactIcon } from '../icons/react_small.svg';
import { analyticsEvents } from '../analyticsEvents';
import { TSkin } from '@epam/uui-docs';

export class StartedBlock extends React.Component {
    private forDevelopersEvent = analyticsEvents.welcome.gettingStarted('For developers');
    private forDesignersEvent = analyticsEvents.welcome.gettingStarted('For designers');
    render() {
        return (
            <div className={ css.layout }>
                <FlexRow borderBottom cx={ css.landingStarted }>
                    <RichTextView>
                        <h2 className={ css.header }>Getting Started</h2>
                    </RichTextView>
                    <FlexRow spacing="18" cx={ css.content }>
                        <div className={ css.contentColumn }>
                            <div className={ css.contentColumnWrapper }>
                                <div className={ css.contentIcon } style={ { backgroundColor: '#E3FCFC' } }>
                                    <IconContainer icon={ ReactIcon } />
                                </div>
                                <Text fontSize="24" lineHeight="30" cx={ css.contentText }>
                                    React Components, Demos, Packages
                                </Text>
                                <FlexRow alignItems="center">
                                    <Button
                                        rawProps={ { 'aria-label': 'For Developers' } }
                                        caption="FOR DEVELOPERS"
                                        fill="white"
                                        size="48"
                                        color="blue"
                                        clickAnalyticsEvent={ this.forDevelopersEvent }
                                        link={ { pathname: 'documents', query: { id: 'gettingStarted' } } }
                                    />
                                </FlexRow>
                            </div>
                        </div>

                        <div className={ css.contentColumn }>
                            <div className={ css.contentColumnWrapper }>
                                <div className={ css.contentIcon } style={ { backgroundColor: '#FAE4CF' } }>
                                    <IconContainer icon={ CrystalIcon } />
                                </div>
                                <Text fontSize="24" lineHeight="30" cx={ css.contentText }>
                                    Design Library, Guidelines, Palettes
                                </Text>
                                <FlexRow alignItems="center">
                                    <Button
                                        rawProps={ { 'aria-label': 'For Designers' } }
                                        caption="FOR DESIGNERS"
                                        fill="white"
                                        size="48"
                                        color="blue"
                                        link={ {
                                            pathname: 'documents',
                                            query: {
                                                id: 'gettingStartedForDesigners',
                                                category: 'forDesigners',
                                                mode: 'doc',
                                                skin: TSkin.UUI4_promo,
                                            },
                                        } }
                                        clickAnalyticsEvent={ this.forDesignersEvent }
                                    />
                                </FlexRow>
                            </div>
                        </div>
                    </FlexRow>
                </FlexRow>
            </div>
        );
    }
}
