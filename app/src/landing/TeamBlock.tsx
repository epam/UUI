import * as React from 'react';
import Measure from 'react-measure';
import { FlexCell, FlexRow, FlexSpacer, LinkButton, Text } from '@epam/promo';
import { team } from '../docs';
import { analyticsEvents } from '../analyticsEvents';
import * as css from './TeamBlock.scss';
import * as linkIcon from '@epam/assets/icons/common/navigation-chevron-right-18.svg';

export class TeamBlock extends React.Component {
    render() {
        return (
            <Measure bounds >
                {
                    ({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any, contentRect: any }) => {
                        const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                        return (
                            <div className={ css.layout } ref={ measureRef } >
                                <FlexCell cx={ css.teams } width='100%'>
                                    <FlexRow size='36' cx={ css.headerWrapper } >
                                        <Text font='museo-sans' cx={ css.header } >Team</Text>
                                        <FlexSpacer />
                                        <LinkButton size={ containerWidth > 768 ? '48' : '30' } icon={ containerWidth <= 768 ? linkIcon : undefined } caption={ containerWidth > 768 && 'View All Members' } link={ { pathname: '/documents', query: { id: 'team' } } } />
                                    </FlexRow>
                                    <div className={ css.teamsCards } >
                                        { team.map(({ name, position, src, link, isDefault }, index) => {
                                            if (!isDefault) return;
                                            return (
                                                <div key={ index } className={ css.card } >
                                                    <img alt={ name } src={ src } width='180' height='180' />
                                                    <LinkButton size='24' caption={ name } target='_blank' href={ link } clickAnalyticsEvent={ analyticsEvents.welcome.team(name) } />
                                                    <Text font='sans' lineHeight='24' fontSize='16' size='none' >{ position }</Text>
                                                </div>
                                            );
                                        }) }
                                    </div>
                                </FlexCell>
                            </div>
                        );
                    }
                }
            </Measure>
        );
    }
}