import React, { FC, SVGProps } from 'react';
import { Badge, Button, FlexRow, IconContainer, LinkButton, Panel, Text, ButtonProps, FlexCell } from '@epam/uui';
import css from './ExploreBenefitsBlock.module.scss';
import { ReactComponent as OpenSourceIcon } from '../icons/open-source.svg';
import { ReactComponent as StarsIcon } from '../icons/stars.svg';
import { ReactComponent as flagIcon } from '../icons/flag.svg';
import { ReactComponent as windows } from '../icons/windows.svg';
import { ReactComponent as brushBuilder } from '../icons/brush-builder.svg';
import { ReactComponent as actionLockIcon } from '../icons/action-lock-open.svg';
import { ReactComponent as notificationHelpIcon } from '../icons/notification-help.svg';

interface IExploreTopBlockItem {
    id: number,
    icon: { element: FC<SVGProps<SVGSVGElement>>, background: string },
    caption: string,
    text: React.ReactNode,
    footer: null | { linkCaption: string, href: string }
}

const topExploreBlocks: IExploreTopBlockItem[] = [
    { id: 0, icon: { element: StarsIcon, background: '#FFFFF0' }, caption: 'Figma components aligned with React', text: 'Guidelines, examples, do/don’s recommendations and many other useful guides for designer and developer', footer: null },
    {
        id: 1,
        icon: { element: flagIcon, background: '#FDE1E1' },
        caption: 'Integrated solutions & front-end accelerating facilities',
        text: 'Common services, state-management primitives: Forms with validation,'
            + ' Lists and Tables with lazy-loading',
        footer: null,
    },
    { id: 2, icon: { element: windows, background: '#97D9B7' }, caption: '60+ rich components', text: 'Rich set of components: from buttons to data tables, that meets WCAG 2.0 Level AA conformance', footer: { linkCaption: 'See components', href: '/' } },
    {
        id: 3,
        icon: { element: brushBuilder, background: '#DBCCFA' },
        caption: 'Themization',
        /* eslint-disable react/jsx-closing-tag-location */
        text: <span>
            Easy to create and support your own brand theme.
            <br />
            Allows deep customization to build your own brand UI components set on top
        </span>,
        footer: { linkCaption: 'Open builder', href: '/' },
    },
];

interface IExploreBottomBlockItem {
    id: number,
    icon: { element: FC<SVGProps<SVGSVGElement>>, background: string },
    caption: string,
    captionBadge: null | { icon: FC<SVGProps<SVGSVGElement>>, caption: string },
    text: string,
    footer: null | { linkCaption: string, href: string, color: ButtonProps['color'] }[]
}

const bottomExploreBlocks: IExploreBottomBlockItem[] = [
    {
        id: 0,
        icon: { element: actionLockIcon, background: '#CDEEDD' },
        caption: 'Open Source',
        captionBadge: { icon: OpenSourceIcon, caption: 'MIT License' },
        text: 'Open for contribution, actively evolving, supported, and used by 40+ EPAM internal production projects',
        footer: [
            { linkCaption: 'Figma Community', href: '/', color: 'accent' },
            { linkCaption: 'Github', href: '/', color: 'accent' },
        ],
    }, {
        id: 1,
        icon: { element: notificationHelpIcon, background: '#CEE1FC' },
        caption: 'Support',
        captionBadge: null,
        text: 'Ongoing support during project live cycle. Access to a dedicated UUI team of architect, designers and developers',
        footer: [
            { linkCaption: 'Contact Us', href: '/', color: 'primary' },
        ],
    },
];

export function ExploreBenefitsBlock() {
    return (
        <div className={ css.root }>
            <div className={ css.container }>
                <Text cx={ css.exploreHeader } fontWeight="600">Explore UUI benefits</Text>
                <div className={ css.topBlockWrapper }>
                    { topExploreBlocks.map((item) => (
                        <Panel cx={ css.topBlockPanel }>
                            <IconContainer icon={ item.icon.element } cx={ css.topBlockIcon } size="18" style={ { backgroundColor: item.icon.background } } />
                            <FlexCell cx={ css.topBlockContextWrapper }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.topBlockCaption }>{ item.caption }</Text>
                                <Text fontSize="16" lineHeight="24" cx={ css.topBlockText }>{ item.text }</Text>
                            </FlexCell>
                            { item.footer && (
                                <FlexRow cx={ css.topBlockFooter } justifyContent="center">
                                    <LinkButton
                                        size="48"
                                        caption={ item.footer.linkCaption }
                                        href={ item.footer.href }
                                        onClick={ () => {
                                        } }
                                    />
                                </FlexRow>
                            ) }
                        </Panel>
                    )) }
                </div>
                <div className={ css.bottomBlockWrapper }>
                    { bottomExploreBlocks.map((item) => (
                        <Panel cx={ css.bottomBlockPanel }>
                            <IconContainer size="36" icon={ item.icon.element } cx={ css.bottomBlockIcon } style={ { backgroundColor: item.icon.background } } />
                            <FlexRow cx={ css.bottomBlockCaptionWrapper }>
                                <Text fontSize="24" lineHeight="30" fontWeight="600" cx={ css.bottomBlockCaption }>{ item.caption }</Text>
                                { item.captionBadge
                                && <Badge color="success" fill="outline" size="24" cx={ css.bottomItemBadge } icon={ item.captionBadge.icon } caption={ item.captionBadge.caption } /> }

                            </FlexRow>
                            <Text fontSize="16" lineHeight="24" cx={ css.bottomBlockText }>{ item.text }</Text>
                            { item.footer && (
                                <FlexRow cx={ css.bottomBlockFooter } columnGap="6">
                                    { item.footer.map((footerItem) => (
                                        <Button
                                            href={ footerItem.href }
                                            color={ footerItem.color }
                                            fill="none"
                                            caption={ footerItem.linkCaption }
                                            onClick={ () => {
                                            } }
                                        />
                                    )) }
                                </FlexRow>
                            ) }
                        </Panel>
                    )) }
                </div>
            </div>
        </div>
    );
}
