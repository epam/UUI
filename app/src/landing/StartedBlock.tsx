import * as React from 'react';
import { Button, FlexRow, IconContainer, RichTextView, Text } from '@epam/promo';
import * as css from './StartedBlock.scss';
import * as crystalIcon from '../icons/crystal.svg';
import * as reactIcon from '../icons/react_small.svg';
import { UUI4 } from "../common";
import {analyticsEvents} from "../analyticsEvents";

export class StartedBlock extends React.Component {
    private forDevelopersEvent = analyticsEvents.welcome.gettingStarted("For developers");
    private forDesignersEvent = analyticsEvents.welcome.gettingStarted("For designers");

    render() {
        return (
            <div className={ css.layout }>
                <FlexRow borderBottom cx={ css.landingStarted }>
                    <RichTextView>
                        <h2 className={ css.header }>Getting Started</h2>
                    </RichTextView>
                    <FlexRow spacing='18' cx={ css.content }>
                        <div className={ css.contentColumn }>
                            <div className={ css.contentColumnWrapper }>
                                <div className={ css.contentIcon } style={ {backgroundColor: '#E3FCFC'} }>
                                    <IconContainer icon={ reactIcon }/>
                                </div>
                                <Text fontSize='24' lineHeight='30'
                                      cx={ css.contentText }>{ 'Learn more about React Components, Demos, Packages & Documentation' }</Text>
                                <FlexRow alignItems='center'>
                                    <Button
                                        caption='FOR DEVELOPERS'
                                        fill='white'
                                        size='48'
                                        color='blue'
                                        clickAnalyticsEvent={ this.forDevelopersEvent }
                                        link={ { pathname: 'documents', query: { id: 'gettingStarted' } } }
                                    />
                                </FlexRow>
                            </div>
                        </div>

                        <div className={ css.contentColumn }>
                            <div className={ css.contentColumnWrapper }>
                                <div className={ css.contentIcon } style={ {backgroundColor: '#FAE4CF'} }>
                                    <IconContainer icon={ crystalIcon }/>
                                </div>
                                <Text fontSize='24' lineHeight='30'
                                      cx={ css.contentText }>{ 'Learn more about Design Library, Specifications, Palettes & Typography' }</Text>
                                <FlexRow alignItems='center'>
                                    <Button
                                        caption='FOR DESIGNERS'
                                        fill='white'
                                        size='48'
                                        color='blue'
                                        link={ {
                                            pathname: 'documents',
                                            query: {
                                                id: 'gettingStartedForDesigners',
                                                category: 'forDesigners',
                                                mode: 'doc',
                                                skin: UUI4,
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
