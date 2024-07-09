import * as React from 'react';
import css from './AppFooter.module.scss';
import {
    FlexRow, Text, Anchor, IconContainer, FlexCell,
} from '@epam/uui';
import { ReactComponent as EPAMIcon } from '../icons/EPAM.svg';

const EPAM_LINK = 'https://www.epam.com';

export function AppFooter() {
    const getLinks = (caption: string, links: { href: string, name: string }[]) => {
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
        <div className={ css.root }>
            <div className={ css.container }>
                <FlexCell cx={ css.firstBlock } grow={ 1 }>
                    <Anchor rawProps={ { tabIndex: -1, 'aria-label': 'EPAM' } } href={ EPAM_LINK } target="_blank">
                        <IconContainer icon={ EPAMIcon } />
                    </Anchor>
                    <Text color="disabled" cx={ css.sponsorText }>Sponsored by EPAM Licensed under MIT License</Text>
                    <FlexRow columnGap={ 18 } cx={ css.bottomLinks }>
                        <Anchor href="/" target="_blank">
                            <Text color="white">Privacy Policy</Text>
                        </Anchor>
                        <Anchor href="/" target="_blank">
                            <Text color="white">Cookies Policy</Text>
                        </Anchor>
                    </FlexRow>
                </FlexCell>
                <FlexCell cx={ css.secondBlock } grow={ 1 }>
                    <FlexRow columnGap={ 48 } alignItems="top">
                        {getLinks('Resources', [{ href: 'https://uui.epam.com/documents', name: 'Docs' }, { href: 'https://uui.epam.com/documents?category=components&id=accordion', name: 'Components' }, { href: 'https://uui.epam.com/demo', name: 'Examples' }, { href: 'https://uui.epam.com/documents?id=gettingStartedForDesigners&category=forDesigners', name: 'Design' }])}
                        {getLinks('Links', [{ href: '/', name: 'Figma' }, { href: 'https://github.com/epam/UUI', name: 'GitHub' }])}
                        {getLinks('Community', [{ href: '/', name: 'Skype' }, { href: '/', name: 'Microsoft Teams' }])}
                        {getLinks('Help', [{ href: '/', name: 'FAQ' }, { href: 'https://uui.epam.com/documents?id=releaseNotes', name: 'Release notes' }])}
                    </FlexRow>
                </FlexCell>
            </div>
        </div>
    );
}
