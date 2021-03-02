import * as React from 'react';
import * as css from './DownloadsDoc.scss';
import { Button, FlexCell, FlexRow, FlexSpacer, IconContainer, LinkButton, RichTextView, Text, Tooltip } from '@epam/promo';
import { cx } from '@epam/uui';
import { BaseDocsBlock, UUI4 } from '../../common/docs';
import * as linkIcon from '../../icons/action-external_link-18.svg';
import * as fontIcon from '../../icons/fonts_icon.svg';
import * as logotypeIcon from '../../icons/design_platform_icon.svg';
import * as downloadIcon from '../../icons/download_icon_set.svg';
import * as lockIcon from '@epam/assets/icons/common/action-lock-fill-18.svg';

const assets = {
    UUI3: {
        installDocs: 'https://kb.epam.com/display/EPMUXD/2.+Installation+Guide+UUI3+Library',
        fonts: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Fonts_UUI3.7z',
        colors: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Palette_UUI3.7z',
        logos: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Logotypes_UUI3.7z',
        icons: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI3/Icons_UUI3.7z',
    },
    UUI4: {
        installDocs: 'https://kb.epam.com/display/EPMUXD/3.+Installation+Guide+for+UUI4+Library',
        fonts: 'https://epam.sharepoint.com/:u:/r/sites/EPAMUII3/Shared%20Documents/General/UUI%20fonts/Fonts_UUI4.7z?csf=1&web=1&e=3VU4QA',
        colors: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Palette_UUI4.7z',
        logos: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Logotypes_UUI4.7z',
        icons: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/UUI4/Icons_UUI4.7z',
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

    renderContent() {
        const isUUI4Skin = this.getQuery('skin') === UUI4;
        return (
            <>
                <FlexRow alignItems='top' cx={ css.headerRow } >
                    <FlexCell minWidth={ 468 } cx={ css.contentBlock } >
                        <RichTextView size='16' >
                            <h2>Sketch Library</h2>
                            <p>
                                For full-scale work with design documents you need to install the component library.
                                Here you will find detailed instructions on how to install the library,
                                additional files and answers to frequent questions.
                            </p>
                        </RichTextView>
                        <FlexRow>
                            <Button
                                color='green'
                                size='36'
                                icon={ linkIcon }
                                target='_blank'
                                caption='Install Library'
                                href={ isUUI4Skin ? assets.UUI4.installDocs : assets.UUI3.installDocs }
                            />
                        </FlexRow>
                    </FlexCell>
                    <FlexCell minWidth={ 468 } textAlign='center' >
                        <img alt='sketch icon' src='/static/images/sketch_img.png' />
                    </FlexCell>
                </FlexRow>
                <FlexRow alignItems='bottom' cx={ css.downloadsRow } >
                    <FlexCell minWidth={ 320 } textAlign='center' cx={ css.downloadsColumn } >
                        <div className={ cx(css.downloadsOval, css.fontPackBackground) } >
                            <IconContainer icon={ fontIcon } />
                        </div>
                        <Text size='30' fontSize='24' font='museo-sans' >Font Pack</Text>
                        {
                            isUUI4Skin
                            ? <Tooltip content='For internal use only' offset='-1' >
                                <LinkButton
                                    icon={ lockIcon }
                                    caption='Download'
                                    size='24'
                                    href={ assets.UUI4.fonts }
                                />
                            </Tooltip>
                            : <LinkButton
                                caption='Download'
                                size='24'
                                href={ assets.UUI3.fonts }
                            />
                        }
                    </FlexCell>
                    <FlexCell minWidth={ 320 } textAlign='center' cx={ css.downloadsColumn } >
                        <div className={ cx(css.downloadsOval, css.logotypesBackground) } >
                            <IconContainer icon={ logotypeIcon } />
                        </div>
                        <Text size='30' fontSize='24' font='museo-sans' >Logotypes</Text>
                        <LinkButton
                            caption='Download'
                            size='24'
                            href={ isUUI4Skin ? assets.UUI4.logos : assets.UUI3.logos }
                        />
                    </FlexCell>
                    <FlexCell minWidth={ 320 } textAlign='center' cx={ css.downloadsColumn } >
                        <div className={ cx(css.downloadsOval, css.iconSetBackground) } >
                            <IconContainer icon={ downloadIcon } />
                        </div>
                        <Text size='30' fontSize='24' font='museo-sans' >Icon Set</Text>
                        <LinkButton
                            caption='Download'
                            size='24'
                            href={ isUUI4Skin ? assets.UUI4.icons : assets.UUI3.icons }
                        />
                    </FlexCell>
                </FlexRow>
            </>
        );
    }
}