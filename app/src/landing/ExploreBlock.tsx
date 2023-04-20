import * as React from 'react';
import css from './ExploreBlock.scss';
import {
    Anchor, FlexRow, IconContainer, Text,
} from '@epam/promo';
import { ReactComponent as DownloadIcon } from '../icons/download.svg';
import { UUI4 } from '../common/docs';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';

export class ExploreBlock extends React.Component {
    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.exploreAndDownload(link));
    };

    render() {
        return (
            <div className={ css.layout }>
                <FlexRow cx={ css.explore } borderBottom>
                    <div className={ css.wrapper }>
                        <Text font="museo-sans" cx={ css.header }>
                            Explore & Download
                        </Text>
                        <div className={ css.content }>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ { pathname: '/documents', query: { id: 'promoColors', category: 'assets' } } }
                                onClick={ () => this.sendEvent('Color palette') }
                            >
                                <div tabIndex={ 0 } className={ css.colorPalette }>
                                    <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Color Palette
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ {
                                    pathname: '/documents',
                                    query: {
                                        id: 'richTextView', mode: 'doc', skin: UUI4, category: 'components',
                                    },
                                } }
                                onClick={ () => this.sendEvent('Typography') }
                            >
                                <div tabIndex={ 0 } className={ css.typography }>
                                    <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Typography
                                    </Text>
                                    <Text font="museo-sans" cx={ css.typographyIcon }>
                                        Aa
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ { pathname: '/documents', query: { id: 'downloads', category: 'assets', skin: UUI4 } } }
                                onClick={ () => this.sendEvent('Downloads') }
                            >
                                <div tabIndex={ 0 } className={ css.download }>
                                    <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Download Assets
                                    </Text>
                                    <IconContainer rawProps={ { tabIndex: -1 } } icon={ DownloadIcon } cx={ css.downloadIcon } />
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ {
                                    pathname: '/documents',
                                    query: {
                                        id: 'accordion', mode: 'doc', skin: UUI4, category: 'components',
                                    },
                                } }
                                onClick={ () => this.sendEvent('Components') }
                            >
                                <div tabIndex={ 0 } className={ css.components }>
                                    <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Components
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor rawProps={ { tabIndex: -1 } } link={ { pathname: '/demo' } } onClick={ () => this.sendEvent('Demo') }>
                                <div tabIndex={ 0 } className={ css.demo }>
                                    <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Demo
                                    </Text>
                                </div>
                            </Anchor>
                        </div>
                    </div>
                </FlexRow>
            </div>
        );
    }
}
