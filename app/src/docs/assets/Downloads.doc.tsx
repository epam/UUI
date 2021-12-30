import * as React from 'react';
import { cx } from '@epam/uui';
import { FlexCell, FlexRow, FlexSpacer, IconContainer, LinkButton, RichTextView, Text, Tooltip } from '@epam/promo';
import { BaseDocsBlock, UUI4 } from '../../common/docs';
import { getQuery } from '../../helpers';
import * as css from './DownloadsDoc.scss';
import { ReactComponent as Artbord } from '../../icons/artboard.svg';
import { ReactComponent as Sketch } from '../../icons/sketch.svg';
import { ReactComponent as FontIcon } from '../../icons/fonts_icon.svg';
import { ReactComponent as IllustrationsIcon } from '../../icons/illustrations_icon.svg';
import { ReactComponent as LogotypeIcon } from '../../icons/design_platform_icon.svg';
import { ReactComponent as DownloadIcon } from '../../icons/download_icon_set.svg';
import { ReactComponent as LockIcon } from '@epam/assets/icons/common/action-lock-fill-18.svg';
import { ReactComponent as DownloadFileIcon } from '@epam/assets/icons/common/file-download-18.svg';
import { ReactComponent as ContentLinkIcon } from '@epam/assets/icons/common/content-link-18.svg';

const libraries = {
    UUI3: [
        {
            title: 'UUI3 Library',
            additionalInfo: 'Requires Sketch 70 or greater',
            link: 'sketch://add-library?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyaroslav-zonov%2FUUIDesign%2Fmain%2FUUI%25203.0%2FLight%2FUUI3.xml',
            image: Sketch,
            libraryType: 'sketch',
        },
        {
            title: 'UUI3 Library(Dark)',
            additionalInfo: 'Requires Sketch 70 or greater',
            link: 'sketch://add-library?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyaroslav-zonov%2FUUIDesign%2Fmain%2FUUI%25203.0%2FDark%2FUUI3%255BDark%255D.xml',
            image: Sketch,
            libraryType: 'sketch',
        },
        {
            title: 'UUI3 Components Library',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/M5Njgc6SQJ3TPUccp5XHQx/UUI3-(Components)?node-id=280%3A85528',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Assets Library',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/3mpAy3BEZ75n5GJEZ5UV8z/UUI-(Assets)?node-id=0%3A2097',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Patterns',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/qb7WHgBkyBpovFlOZRe30p/UUI-Patterns',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Illustartions',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/fNIMFXueuk3pfJzL4lWCex/UUI-Illustrations',
            image: Artbord,
            libraryType: 'figma',
        },
    ],
    UUI4: [
        {
            title: 'UUI4 Library',
            additionalInfo: 'Requires Sketch 70 or greater',
            link: 'sketch://add-library?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyaroslav-zonov%2FUUIDesign%2Fmain%2FUUI%25204.0%2FUUI4.xml',
            image: Sketch,
            libraryType: 'sketch',
        },
        {
            title: 'UUI4 Components Library',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/UyChXPLmyv5zMrOU37KdUL/UUI4-(Components)?node-id=280%3A85528',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Assets Library',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/3mpAy3BEZ75n5GJEZ5UV8z/UUI-(Assets)?node-id=0%3A2097',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Patterns',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/qb7WHgBkyBpovFlOZRe30p/UUI-Patterns',
            image: Artbord,
            libraryType: 'figma',
        },
        {
            title: 'UUI Illustartions',
            additionalInfo: 'Requires Figma 97 or greater',
            link: 'https://www.figma.com/file/fNIMFXueuk3pfJzL4lWCex/UUI-Illustrations',
            image: Artbord,
            libraryType: 'figma',
        },
    ],
};

const assets = {
    UUI3: {
        fonts: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Fonts_UUI3.7z',
        logos: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Logotypes_UUI3.7z',
        icons: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Icons_UUI3.7z',
        illustrations: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/uui-illustrations/UUI_Illustrations.zip',
    },
    UUI4: {
        fonts: 'https://epam.sharepoint.com/:u:/r/sites/EPAMUII3/Shared%20Documents/General/UUI%20fonts/Fonts_UUI4.7z?csf=1&web=1&e=3VU4QA',
        logos: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Logotypes_UUI4.7z',
        icons: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Icons_UUI4.7z',
        illustrations: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/uui-illustrations/UUI_Illustrations.zip',
    },
};

export class DownloadsDoc extends BaseDocsBlock {
    title = 'Downloads';

    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{ this.title }</div>
                <FlexSpacer />
                { this.renderMultiSwitch() }
            </FlexRow>
        );
    }

    renderLibraryCard({ title, additionalInfo, link, image, libraryType }: any) {
        return (
            <FlexCell minWidth={ 320 }>
                <FlexRow spacing='12'>
                    <IconContainer icon={ image } />
                    <FlexCell width='auto'>
                        <LinkButton href={ link } size='24' captionCX={ css.libraryLinkTitle } caption={ title }  iconPosition='right' icon={ libraryType === 'sketch' ? DownloadFileIcon : ContentLinkIcon } />
                        <Text size='18' fontSize='12' lineHeight='18' color='gray60' >{ additionalInfo }</Text>
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }

    renderContent() {
        const isUUI4Skin = getQuery('skin') === UUI4;
        return (
            <>
                <FlexRow alignItems='top'  cx={ css.headerRow } >
                    <FlexCell width='100%' cx={ css.contentBlock } >
                        <RichTextView size='16' >
                            <h2>Design Libraries</h2>
                            <p>
                                For full-scale work with design documents you need to install the component library.
                                Here you will find detailed instructions on how to install the library,
                                additional files and answers to frequent questions.
                            </p>
                        </RichTextView>
                        <FlexRow cx={ css.libraryBlock } >
                            { libraries[isUUI4Skin ? 'UUI4' : 'UUI3'].map(item => this.renderLibraryCard(item)) }
                        </FlexRow>
                    </FlexCell>
                </FlexRow>
                <FlexCell>
                    <RichTextView size='16' >
                        <h2>Assets</h2>
                    </RichTextView>
                    <FlexRow alignItems='bottom' cx={ css.downloadsRow } >
                        <FlexCell minWidth={ 320 } >
                            <FlexRow spacing='12' >
                                <div className={ cx(css.downloadsOval, css.fontPackBackground) } >
                                    <IconContainer icon={ FontIcon } />
                                </div>
                                <FlexCell width='auto' >
                                    <Text size='24' fontSize='16' font='museo-sans' >Font Pack</Text>
                                    {
                                        isUUI4Skin
                                            ? <Tooltip content='For internal use only' offset={ [0, -1] } >
                                                <LinkButton
                                                    iconPosition='right'
                                                    icon={ LockIcon }
                                                    caption='Download'
                                                    size='24'
                                                    href={ assets.UUI4.fonts }
                                                    captionCX={ css.assetsLinkCaption }
                                                />
                                            </Tooltip>
                                            : <LinkButton
                                                caption='Download'
                                                size='24'
                                                href={ assets.UUI3.fonts }
                                                captionCX={ css.assetsLinkCaption }
                                            />
                                    }
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                        <FlexCell minWidth={ 320 } >
                            <FlexRow spacing='12' >
                                <div className={ cx(css.downloadsOval, css.logotypesBackground) } >
                                    <IconContainer icon={ LogotypeIcon } />
                                </div>
                                <FlexCell width='auto'>
                                    <Text size='24' fontSize='16' font='museo-sans' >Logotypes</Text>
                                    <LinkButton
                                        caption='Download'
                                        size='24'
                                        href={ isUUI4Skin ? assets.UUI4.logos : assets.UUI3.logos }
                                        captionCX={ css.assetsLinkCaption }
                                    />
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                        <FlexCell minWidth={ 320 } >
                            <FlexRow spacing='12' >
                                <div className={ cx(css.downloadsOval, css.iconSetBackground) } >
                                    <IconContainer icon={ DownloadIcon } />
                                </div>
                                <FlexCell width='auto' >
                                    <Text size='24' fontSize='16' font='museo-sans' >Icon Set</Text>
                                    <LinkButton
                                        caption='Download'
                                        size='24'
                                        href={ isUUI4Skin ? assets.UUI4.icons : assets.UUI3.icons }
                                        captionCX={ css.assetsLinkCaption }
                                    />
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow alignItems='bottom' cx={ css.downloadsRow } >
                        <FlexCell minWidth={ 480 } >
                            <FlexRow spacing='12' >
                                <div className={ cx(css.downloadsOval, css.illustrationsBackground) } >
                                    <IconContainer icon={ IllustrationsIcon } />
                                </div>
                                <FlexCell width='auto'>
                                    <Text size='24' fontSize='16' font='museo-sans' >UUI Illustartions (SVG pack & Guidline)</Text>
                                    <LinkButton
                                        caption='Download'
                                        size='24'
                                        href={ isUUI4Skin ? assets.UUI4.illustrations : assets.UUI3.illustrations }
                                        captionCX={ css.assetsLinkCaption }
                                    />
                                </FlexCell>
                            </FlexRow>
                        </FlexCell>
                    </FlexRow>
                </FlexCell>
            </>
        );
    }
}
