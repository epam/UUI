import * as React from 'react';
import Measure from 'react-measure';

import {
    FlexRow, IconContainer, LinkButton, Text, Anchor,
} from '@epam/uui';
import { analyticsEvents } from '../analyticsEvents';
import css from './ContactsBlock.module.scss';
import { ReactComponent as MailIcon } from '../icons/outlook-90.svg';
import { ReactComponent as GitIcon } from '../icons/github-90.svg';

const EMAIL = 'AskUUI@epam.com';
const GIT_LINK = 'https://github.com/epam/UUI/issues';

export class ContactsBlock extends React.Component {
    private emailClickEvent = analyticsEvents.welcome.email();
    private submitIssueClickEvent = analyticsEvents.welcome.submitIssue();
    render() {
        return (
            <Measure bounds>
                {({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any; contentRect: any }) => {
                    const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                    return (
                        <div className={ css.layout } ref={ measureRef }>
                            <div className={ css.contacts }>
                                <div className={ css.wrapper }>
                                    <Text cx={ css.header }>
                                        Contact Us
                                    </Text>
                                </div>
                                <FlexRow cx={ css.contactsCards } vPadding="48">
                                    <div className={ css.card }>
                                        {containerWidth > 1280 ? (
                                            <>
                                                <IconContainer icon={ GitIcon } cx={ css.cardIcon } />
                                                <div className={ css.cardTextContent }>
                                                    <Text fontSize="16" lineHeight="24">
                                                        Missing a feature or have an issue?
                                                    </Text>
                                                    <LinkButton
                                                        size="24"
                                                        caption="Submit an Issue"
                                                        target="_blank"
                                                        href={ GIT_LINK }
                                                        cx={ css.linkButton }
                                                        clickAnalyticsEvent={ this.submitIssueClickEvent }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <Anchor rawProps={ { 'aria-label': 'Github' } } href={ GIT_LINK } target="_blank">
                                                <IconContainer icon={ GitIcon } size={ containerWidth > 768 ? 60 : null } cx={ css.cardIcon } />
                                            </Anchor>
                                        )}
                                    </div>
                                    <div className={ css.card }>
                                        {containerWidth > 1280 ? (
                                            <>
                                                <IconContainer icon={ MailIcon } cx={ css.cardIcon } />
                                                <div className={ css.cardTextContent }>
                                                    <Text fontSize="16" lineHeight="24">
                                                        You can also email your questions to submit a support ticket
                                                    </Text>
                                                    <LinkButton
                                                        size="24"
                                                        caption="Email us"
                                                        target="_blank"
                                                        href={ `mailto:${EMAIL}` }
                                                        cx={ css.linkButton }
                                                        clickAnalyticsEvent={ this.emailClickEvent }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <Anchor rawProps={ { 'aria-label': 'Email' } } href={ `mailto:${EMAIL}` } target="_blank">
                                                <IconContainer icon={ MailIcon } size={ containerWidth > 768 ? 180 : null } cx={ css.cardIcon } />
                                            </Anchor>
                                        )}
                                    </div>
                                </FlexRow>
                            </div>
                        </div>
                    );
                }}
            </Measure>
        );
    }
}
