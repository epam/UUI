import * as React from 'react';
import Measure from 'react-measure';
import {
    FlexRow, FlexSpacer, LinkButton, Text,
} from '@epam/promo';
import { ReleasesCell } from './ReleasesCell';
import { svc } from '../services';
import css from './ReleasesBlock.module.scss';
import { analyticsEvents } from '../analyticsEvents';

interface LandingReleasesState {
    markdown: any | null;
    isLoaded: boolean;
}

export class ReleasesBlock extends React.Component<{}, LandingReleasesState> {
    state: LandingReleasesState = {
        markdown: null,
        isLoaded: false,
    };

    componentDidMount() {
        svc.api
            .getChangelog()
            .then((response) => response)
            .then((data) => {
                this.setState({
                    markdown: data.markdown
                        .split('#')
                        .filter((el: any) => el !== '')
                        .map((el: any) => '#'.concat(el)),
                    isLoaded: true,
                });
            });
    }

    render() {
        const { markdown, isLoaded } = this.state;
        return (
            <Measure bounds>
                {({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any; contentRect: any }) => {
                    const containerWidth = window ? window.innerWidth : contentRect.bounds.width;
                    const layout = containerWidth > 1280 ? 'desktop' : containerWidth > 768 ? 'tablet' : 'mobile';

                    return (
                        <div className={ css.layout } ref={ measureRef }>
                            <FlexRow cx={ css.releases }>
                                <div className={ css.wrapper }>
                                    <FlexRow size="36" cx={ css.headerWrapper }>
                                        <Text font="museo-sans" cx={ css.header }>
                                            Release Notes
                                        </Text>
                                        {containerWidth > 768 && (
                                            <>
                                                <FlexSpacer />
                                                <LinkButton
                                                    size="48"
                                                    caption="Load older versions"
                                                    link={ { pathname: '/documents', query: { id: 'releaseNotes' } } }
                                                    clickAnalyticsEvent={ analyticsEvents.welcome.releaseNotes() }
                                                />
                                            </>
                                        )}
                                    </FlexRow>
                                    <div className={ css.content }>
                                        <div className={ css.contentWrapper }>
                                            {isLoaded
                                                && markdown
                                                    .slice(0, layout === 'desktop' ? 3 : 2)
                                                    .map((release: any, index: number) => <ReleasesCell layout={ layout } key={ index } content={ release } />)}
                                        </div>
                                    </div>
                                </div>
                            </FlexRow>
                        </div>
                    );
                }}
            </Measure>
        );
    }
}
