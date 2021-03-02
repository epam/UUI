import * as React from 'react';
import * as css from './ExploreBlock.scss';
import { Anchor, FlexRow, IconContainer, Text } from '@epam/promo';
import * as downloadIcon from '../icons/download.svg';
import { UUI4 } from '../common/docs';
import {svc} from "../services";
import {analyticsEvents} from "../analyticsEvents";

export class ExploreBlock extends React.Component {
    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.exploreAndDownload(link));
    }
    
    render() {
        return (
            <div className={ css.layout } >
                <FlexRow cx={ css.explore } borderBottom >
                    <div className={ css.wrapper } >
                        <Text font='museo-sans' cx={ css.header } >Explore & Download</Text>
                        <div className={ css.content } >
                            <Anchor link={ { pathname: '/documents', query: { id: 'promoColors', category: 'assets' } } } onClick={ () => this.sendEvent("Color palette") } >
                                <div className={ css.colorPalette } >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.caption } >Color Palette</Text>
                                </div>
                            </Anchor>
                            <Anchor link={ { pathname: '/documents', query: { id: 'richTextView', mode: 'doc', skin: UUI4, category: 'components' } } } onClick={ () => this.sendEvent("Typography") }>
                                <div className={ css.typography }  >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.caption } >Typography</Text>
                                    <Text font='museo-sans' cx={ css.typographyIcon } >Aa</Text>
                                </div>
                            </Anchor>
                            <Anchor link={ { pathname: '/documents', query: { id: 'downloads', category: 'assets' } } } >
                                <div className={ css.download } onClick={ () => this.sendEvent("Downloads assets") } >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.caption } >Download Assets</Text>
                                    <IconContainer icon={ downloadIcon }  cx={ css.downloadIcon } />
                                </div>
                            </Anchor>
                            <Anchor link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } } onClick={ () => this.sendEvent("Components") } >
                                <div className={ css.components } >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.caption } >Components</Text>
                                </div>
                            </Anchor>
                            <Anchor link={ { pathname: '/demo' } } onClick={ () => this.sendEvent("Demo") } >
                                <div className={ css.demo } >
                                    <Text font='sans-semibold' lineHeight='30' fontSize='24' cx={ css.caption } >Demo</Text>
                                </div>
                            </Anchor>
                        </div>
                    </div>
                </FlexRow>
            </div>
        );
    }
}