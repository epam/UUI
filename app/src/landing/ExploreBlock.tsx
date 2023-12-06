import * as React from 'react';
import css from './ExploreBlock.module.scss';
import {
    Anchor, FlexRow, IconContainer, Text,
} from '@epam/uui';
import { ReactComponent as DownloadIcon } from '../icons/download.svg';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import { TSkin } from '@epam/uui-docs';

export class ExploreBlock extends React.Component {
    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.exploreAndDownload(link));
    };

    render() {
        return (
            <div className={ css.layout }>
                <FlexRow cx={ css.explore } borderBottom>
                    <div className={ css.wrapper }>
                        <Text cx={ css.header }>
                            Explore
                        </Text>
                        <div className={ css.content }>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ {
                                    pathname: '/documents',
                                    query: {
                                        id: 'accordion', mode: 'doc', skin: TSkin.Promo, category: 'components',
                                    },
                                } }
                                onClick={ () => this.sendEvent('Components') }
                            >
                                <div tabIndex={ 0 } className={ css.components }>
                                    <Text fontWeight="600" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Components
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor rawProps={ { tabIndex: -1 } } link={ { pathname: '/demo' } } onClick={ () => this.sendEvent('Demo') }>
                                <div tabIndex={ 0 } className={ css.demo }>
                                    <Text fontWeight="600" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Demos
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ { pathname: '/documents', query: { id: 'promoColors', category: 'assets' } } }
                                onClick={ () => this.sendEvent('Color palette') }
                            >
                                <div tabIndex={ 0 } className={ css.colorPalette }>
                                    <Text fontWeight="600" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Color Palette
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ {
                                    pathname: '/documents',
                                    query: {
                                        id: 'richTextView', mode: 'doc', skin: TSkin.Promo, category: 'components',
                                    },
                                } }
                                onClick={ () => this.sendEvent('Typography') }
                            >
                                <div tabIndex={ 0 } className={ css.typography }>
                                    <Text fontWeight="600" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Typography
                                    </Text>
                                    <Text cx={ css.typographyIcon }>
                                        Aa
                                    </Text>
                                </div>
                            </Anchor>
                            <Anchor
                                rawProps={ { tabIndex: -1 } }
                                link={ { pathname: '/documents', query: { id: 'downloads', category: 'assets', skin: TSkin.Promo } } }
                                onClick={ () => this.sendEvent('Downloads') }
                            >
                                <div tabIndex={ 0 } className={ css.download }>
                                    <Text fontWeight="600" lineHeight="30" fontSize="24" cx={ css.caption }>
                                        Download Assets
                                    </Text>
                                    <IconContainer rawProps={ { tabIndex: -1 } } icon={ DownloadIcon } cx={ css.downloadIcon } />
                                </div>
                            </Anchor>
                        </div>
                    </div>
                </FlexRow>
            </div>
        );
    }
}
