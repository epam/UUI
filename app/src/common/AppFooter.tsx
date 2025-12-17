import * as React from 'react';
import { FlexRow, Text, Anchor, IconContainer, FlexCell, Button } from '@epam/uui';
import { getCurrentTheme } from '../helpers';
import { ReactComponent as EPAMIcon } from '../icons/EPAM.svg';
import { ReactComponent as CommunicationMailFillIcon } from '@epam/assets/icons/communication-mail-fill.svg';
import css from './AppFooter.module.scss';

const EPAM_LINK = 'https://www.epam.com';

const footerLinks = {
    resources: { caption: 'Resources',
        links: [
            { href: 'https://uui.epam.com/documents?id=overview', name: 'Docs' },
            { href: 'https://uui.epam.com/documents?category=components&id=accordion', name: 'Components' },
            { href: 'https://uui.epam.com/demo', name: 'Examples' },
        ] },
    links: { caption: 'Links',
        links: [
            { href: 'https://www.figma.com/community/file/1380452603479283689/epam-uui-v5-7', name: 'Figma' },
            { href: 'https://github.com/epam/UUI', name: 'GitHub' },
            { href: 'https://uui.epam.com/documents?id=releaseNotes', name: 'Release notes' },
            { href: 'https://github.com/epam/UUI/blob/main/CONTRIBUTING.md', name: 'Contribution' },
        ] },
    community: { caption: 'Community',
        links: [
            { href: 'https://github.com/epam/UUI/discussions', name: 'Github Discussions' },
            { href: 'https://teams.microsoft.com/l/team/19%3Af9ce97808e1e419cb976f71d310ca74f%40thread.skype/conversations?groupId=726eb5c9-1516-4c6a-be33-0838d9a33b02&tenantId=b41b72d0-4e9f-4c26-8a69-f949f367c91d', name: 'Microsoft Teams' },
            { href: 'https://wearecommunity.io/communities/uui', name: 'We Are Community' },
        ] },
};

export function AppFooter() {
    const theme = getCurrentTheme();

    const getLinks = ({ caption, links }: { caption: string, links: { href: string, name: string }[] }) => {
        return (
            <FlexCell width="auto">
                <Text color="white" fontWeight="600" fontSize="18">{ caption }</Text>
                {links.map((link) => (
                    <Anchor key={ link.href } href={ link.href } target="_blank">
                        <Text color="white">{ link.name }</Text>
                    </Anchor>
                ))}
            </FlexCell>
        );
    };

    return (
        <div className={ css.root } style={ { backgroundColor: theme === 'electric' ? 'var(--uui-neutral-95)' : 'var(--uui-neutral-90)' } }>
            <div className={ css.container }>
                <FlexCell cx={ css.firstBlock } width="auto" grow={ 1 }>
                    <Anchor rawProps={ { tabIndex: -1, 'aria-label': 'EPAM' } } href={ EPAM_LINK } target="_blank">
                        <IconContainer icon={ EPAMIcon } />
                    </Anchor>
                    <Text color="disabled" cx={ css.sponsorText }>Sponsored by EPAM Licensed under MIT License</Text>
                    <FlexRow columnGap={ 18 } cx={ css.bottomLinks }>
                        <Anchor href="https://privacy.epam.com/core/interaction/showpolicy?type=CommonPrivacyPolicy" target="_blank">
                            <Text color="white">Privacy Policy</Text>
                        </Anchor>
                        <Anchor href="https://www.epam.com/cookie-policy?_gl=1*54xs4n*_gcl_au*OTQ1MzU0OTExLjE3MTg5MDQ1NzU.*_ga*NDA2MDc0MTQwMDAzNTczMzMwMw..*_ga_WBGDS7S6W6*MTcyMjAwNzQyMS4yOS4wLjE3MjIwMDc0MjEuNjAuMC4w" target="_blank">
                            <Text color="white">Cookies Policy</Text>
                        </Anchor>
                    </FlexRow>
                </FlexCell>
                <FlexCell cx={ css.secondBlock } width="auto" grow={ 1 } minWidth={ 650 }>
                    <FlexRow columnGap={ 48 } alignItems="top">
                        <FlexCell width="auto">
                            <Text color="white" fontWeight="600" fontSize="18">Have a question?</Text>
                            <Button href="mailto:AskUUI@epam.com" cx={ css.mailButton } color="primary" caption="Contact us" icon={ CommunicationMailFillIcon } />
                        </FlexCell>
                        {getLinks(footerLinks.resources)}
                        {getLinks(footerLinks.links)}
                        {getLinks(footerLinks.community)}
                    </FlexRow>
                </FlexCell>
            </div>
        </div>
    );
}
