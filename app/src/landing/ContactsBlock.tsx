import * as React from 'react';
import Measure from 'react-measure';

import { FlexRow, IconContainer, LinkButton, Text, Anchor } from '@epam/promo';
import { analyticsEvents } from '../analyticsEvents';
import * as css from './ContactsBlock.scss';
import * as mailIcon from '../icons/outlook-90.svg';
import * as gitIcon from '../icons/github-90.svg';

const EMAIL = 'SupportEPM-UUI@epam.com';
const GIT_LINK = 'https://git.epam.com/epm-tmc/ui/-/issues';

export class ContactsBlock extends React.Component {
    private emailClickEvent = analyticsEvents.welcome.contact('Email');
    private backlogClickEvent = analyticsEvents.welcome.openBacklog();
    
    render() {
        return (
            <Measure bounds>
                {
                    ({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any, contentRect: any }) => {
                        const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                        return (
                            <div className={ css.layout } ref={ measureRef } >
                                <div className={ css.contacts } >
                                    <div className={ css.wrapper } >
                                        <Text font='museo-sans' cx={ css.header } >Contact Us</Text>
                                    </div>
                                    <FlexRow cx={ css.contactsCards } vPadding='48' >
                                        <div className={ css.card } >
                                            { containerWidth > 1280
                                                ? <>
                                                    <IconContainer icon={ gitIcon } cx={ css.cardIcon } />
                                                    <div className={ css.cardTextContent } >
                                                        <Text font='sans' fontSize='16' lineHeight='24' >Missing a feature or have an issue?</Text>
                                                        <LinkButton size='24' caption='Submit an Issue' target='_blank' href={ GIT_LINK } cx={ css.linkButton } clickAnalyticsEvent={ this.backlogClickEvent }/>
                                                    </div>
                                                </>
                                                : <Anchor href={ GIT_LINK } target='_blank' >
                                                    <IconContainer icon={ gitIcon } size={ containerWidth > 768 ? 180 : null } cx={ css.cardIcon } />
                                                </Anchor>
                                            }
                                        </div>
                                        <div className={ css.card } >
                                            { containerWidth > 1280
                                                ? <>
                                                    <IconContainer icon={ mailIcon } cx={ css.cardIcon } />
                                                    <div className={ css.cardTextContent } >
                                                        <Text font='sans' fontSize='16' lineHeight='24' >You can also email your questions to submit a support ticket</Text>
                                                        <LinkButton size='24' caption='Email us' target='_blank' href={ `mailto:${ EMAIL }` } cx={ css.linkButton } clickAnalyticsEvent={ this.emailClickEvent }/>
                                                    </div>
                                                </>
                                                : <Anchor href={ `mailto:${ EMAIL }` } target='_blank' >
                                                    <IconContainer icon={ mailIcon } size={ containerWidth > 768 ? 180 : null } cx={ css.cardIcon } />
                                                </Anchor>
                                            }
                                        </div>
                                    </FlexRow>
                                </div>
                            </div>
                        );
                    }
                }
            </Measure>
        );
    }
}
