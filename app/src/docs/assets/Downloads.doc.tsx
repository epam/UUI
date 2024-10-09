import * as React from 'react';
import { cx } from '@epam/uui-core';
import { FlexCell, FlexRow, IconContainer, LinkButton, RichTextView, Text, Tooltip } from '@epam/uui';
import { BaseDocsBlock } from '../../common/docs';
import css from './DownloadsDoc.module.scss';
import { ReactComponent as FigmaIcon } from '../../icons/figma.svg';
import { ReactComponent as FontIcon } from '../../icons/fonts_icon.svg';
import { ReactComponent as IllustrationsIcon } from '../../icons/illustrations_icon.svg';
import { ReactComponent as LogotypeIcon } from '../../icons/design_platform_icon.svg';
import { ReactComponent as DownloadIcon } from '../../icons/download_icon_set.svg';
import { ReactComponent as LockIcon } from '@epam/assets/icons/common/action-lock-fill-18.svg';
import { ReactComponent as ContentLinkIcon } from '@epam/assets/icons/common/content-link-18.svg';

const library = [
    {
        title: 'UUI Components Library',
        additionalInfo: '4 theme included: Loveship Light, Loveship Dark, Promo and Electric',
        link: 'https://www.figma.com/file/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?type=design&node-id=29222%3A39517&mode=design&t=NuhhdX8NzuSvGdaX-1',
        image: FigmaIcon,
        libraryType: 'figma',
    }, {
        title: 'UUI Assets Library',
        additionalInfo: 'Icons, logotypes, cursors',
        link: 'https://www.figma.com/file/3mpAy3BEZ75n5GJEZ5UV8z/UUI-Assets?type=design&node-id=137%3A2&mode=design&t=bqol9mr8suaBMnCm-1',
        image: FigmaIcon,
        libraryType: 'figma',
    }, {
        title: 'UUI Component Guidelines',
        additionalInfo: 'Guidelines of UUI components',
        link: 'https://www.figma.com/file/dYwal6PrxrPQWg1lL6ijpn/UUI-Guidelines?type=design&node-id=1886%3A625715&mode=design&t=3ve5cI7s6roXxHxw-1',
        image: FigmaIcon,
        libraryType: 'figma',
    }, {
        title: 'UUI Patterns',
        additionalInfo: 'Templates guidelines',
        link: 'https://www.figma.com/file/qb7WHgBkyBpovFlOZRe30p/UUI-Patterns?type=design&node-id=0%3A1&mode=design&t=LByFqSyb9pwJ6FMX-1',
        image: FigmaIcon,
        libraryType: 'figma',
    }, {
        title: 'UUI Illustrations',
        additionalInfo: 'Illustrations pack in addition (promo images, empty states, etc.)',
        link: 'https://www.figma.com/file/fNIMFXueuk3pfJzL4lWCex/UUI-Illustrations?type=design&t=f7W2ssNZnh1LeBJK-6',
        image: FigmaIcon,
        libraryType: 'figma',
    },
];

const assets = {
    fonts: 'https://epam.sharepoint.com/:u:/r/sites/EPAMUII3/Shared%20Documents/General/UUI%20fonts/Fonts_UUI4.7z?csf=1&web=1&e=3VU4QA',
    logos: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Logotypes_UUI4.7z',
    icons: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Icons_UUI4.7z',
    illustrations: 'https://epam.sharepoint.com/:u:/s/EPAMUII3/EahAf6j0ZERKqnbgZwTPFjYBX1HJJC9n845j6xC3FL-gKg?e=K0LQU1',
};

export class DownloadsDoc extends BaseDocsBlock {
    title = 'Downloads';
    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{this.title}</div>
            </FlexRow>
        );
    }

    renderLibraryCard({
        title, additionalInfo, link, image,
    }: any) {
        return (
            <FlexCell key={ title } minWidth={ 320 }>
                <FlexRow columnGap="12">
                    <IconContainer icon={ image } />
                    <FlexCell width="auto">
                        { title === 'UUI Illustrations' ? (
                            <Tooltip content="For internal use only" offset={ [0, 10] }>
                                <LinkButton href={ link } size="24" target="_blank" cx={ css.libraryLinkTitle } caption={ title } iconPosition="right" icon={ LockIcon } />
                            </Tooltip>
                        ) : (
                            <LinkButton
                                href={ link }
                                size="24"
                                target="_blank"
                                cx={ css.libraryLinkTitle }
                                caption={ title }
                                iconPosition="right"
                                icon={ ContentLinkIcon }
                            />
                        )}
                        <Text size="18" fontSize="12" lineHeight="18" color="secondary">
                            {additionalInfo}
                        </Text>
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }

    renderContent() {
        return (
            <>
                <FlexRow alignItems="top" cx={ css.headerRow }>
                    <FlexCell width="100%" cx={ css.contentBlock }>
                        <RichTextView size="16">
                            <h2>Design Libraries</h2>
                            <p>
                                You need to install the component library for full-scale work with design documents. You will find detailed instructions on installing the
                                library, additional files, and answers to frequent questions here.
                            </p>
                        </RichTextView>
                        <FlexRow cx={ css.libraryBlock }>{ library.map((item) => this.renderLibraryCard(item)) }</FlexRow>
                    </FlexCell>
                </FlexRow>
                <FlexCell>
                    <RichTextView size="16">
                        <h2>Assets</h2>
                    </RichTextView>
                    <FlexRow alignItems="bottom" cx={ css.downloadsRow }>
                        <FlexCell minWidth={ 320 }>
                            <FlexRow columnGap="12">
                                <div className={ cx(css.downloadsOval, css.fontPackBackground) }>
                                    <IconContainer icon={ FontIcon } />
                                </div>
                                <FlexCell width="auto">
                                    <Text size="24" fontSize="16" fontWeight="600">
                                        Font Pack
                                    </Text>
                                    <Tooltip content="For internal use only" offset={ [0, 10] }>
                                        <LinkButton
                                            iconPosition="right"
                                            icon={ LockIcon }
                                            caption="Download"
                                            size="24"
                                            href={ assets.fonts }
                                            cx={ css.assetsLinkCaption }
                                        />
                                    </Tooltip>
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                        <FlexCell minWidth={ 320 }>
                            <FlexRow columnGap="12">
                                <div className={ cx(css.downloadsOval, css.logotypesBackground) }>
                                    <IconContainer icon={ LogotypeIcon } />
                                </div>
                                <FlexCell width="auto">
                                    <Text size="24" fontSize="16" fontWeight="600">
                                        Logotypes
                                    </Text>
                                    <LinkButton
                                        caption="Download"
                                        size="24"
                                        href={ assets.logos }
                                        cx={ css.assetsLinkCaption }
                                    />
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                        <FlexCell minWidth={ 320 }>
                            <FlexRow columnGap="12">
                                <div className={ cx(css.downloadsOval, css.iconSetBackground) }>
                                    <IconContainer icon={ DownloadIcon } />
                                </div>
                                <FlexCell width="auto">
                                    <Text size="24" fontSize="16" fontWeight="600">
                                        Icon Set
                                    </Text>
                                    <LinkButton
                                        caption="Download"
                                        size="24"
                                        href={ assets.icons }
                                        cx={ css.assetsLinkCaption }
                                    />
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow alignItems="bottom" cx={ css.downloadsRow }>
                        <FlexCell minWidth={ 480 }>
                            <FlexRow columnGap="12">
                                <div className={ cx(css.downloadsOval, css.illustrationsBackground) }>
                                    <IconContainer icon={ IllustrationsIcon } />
                                </div>
                                <FlexCell width="auto">
                                    <Text size="24" fontSize="16" fontWeight="600">
                                        UUI Illustrations (SVG pack & Guidelines)
                                    </Text>
                                    <FlexRow>
                                        <Tooltip content="For internal use only" offset={ [0, 10] }>
                                            <LinkButton
                                                iconPosition="right"
                                                icon={ LockIcon }
                                                caption="Download"
                                                size="24"
                                                href={ assets.illustrations }
                                                cx={ css.assetsLinkCaption }
                                            />
                                        </Tooltip>
                                    </FlexRow>
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                    </FlexRow>
                </FlexCell>
            </>
        );
    }
}
