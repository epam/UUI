import React, { FC, SVGProps, useEffect } from 'react';
import { Badge, Button, FlexRow, IconContainer, Panel, Text, ButtonProps, FlexCell } from '@epam/uui';
import { getCurrentTheme } from '../helpers';
import cx from 'classnames';
import { ReactComponent as OpenSourceIcon } from '../icons/open-source.svg';
import { ReactComponent as StarsIcon } from '../icons/stars.svg';
import { ReactComponent as flagIcon } from '../icons/flag.svg';
import { ReactComponent as windows } from '../icons/windows.svg';
import { ReactComponent as brushBuilder } from '../icons/brush-builder.svg';
import { ReactComponent as actionLockIcon } from '../icons/action-lock-open.svg';
import { ReactComponent as notificationHelpIcon } from '../icons/notification-help.svg';
import { ReactComponent as CommunicationMailFillIcon } from '@epam/assets/icons/communication-mail-fill.svg';
import css from './ExploreBenefitsBlock.module.scss';

interface IExploreTopBlockItem {
    id: number,
    icon: { element: FC<SVGProps<SVGSVGElement>>, name: string },
    caption: React.ReactNode,
    text: React.ReactNode,
    footer: null | { linkCaption: string, href: string }
}

const topExploreBlocks: IExploreTopBlockItem[] = [
    {
        id: 0,
        icon: { element: StarsIcon, name: 'Stars' },
        caption: 'Figma components aligned with React',
        text: 'Boxed solution with Figma and React libraries, enabling to seamlessly integrate design with front-end and accelerate both',
        footer: null,
    },
    {
        id: 1,
        icon: { element: flagIcon, name: 'Flag' },
        /* eslint-disable react/jsx-closing-tag-location */
        caption: <span>
            Integrated solutions &
            <br />
            front-end accelerating facilities
        </span>,
        text: 'Common services, state-management facilities, complex solutions like Forms with validation,'
            + ' Lists and Tables with lazy-loading and editing',
        footer: null,
    },
    {
        id: 2,
        icon: { element: windows, name: 'Windows' },
        caption: '60+ rich components',
        text: 'Rich set of components: from buttons to data tables, that meets WCAG 2.0 Level AA conformance',
        footer: { linkCaption: 'See Components', href: '/documents?category=components&id=accordion&mode=doc' },
    },
    {
        id: 3,
        icon: { element: brushBuilder, name: 'BrushBuilder' },
        caption: 'Themization',
        /* eslint-disable react/jsx-closing-tag-location */
        text: <span>
            Easy to create and support your own brand theme.
            <br />
            Allows deep customization to build your own brand UI components set on top
        </span>,
        footer: { linkCaption: 'Open Guide', href: '/documents?id=overviewThemes&mode=doc&category=themes' },
    },
];

interface IExploreBottomBlockItem {
    id: number,
    icon: { element: FC<SVGProps<SVGSVGElement>>, name: string },
    caption: string,
    captionBadge: null | { icon: FC<SVGProps<SVGSVGElement>>, caption: string },
    text: string,
    footer: null | { linkCaption: string, href: string, color: ButtonProps['color'] }[]
}

const bottomExploreBlocks: IExploreBottomBlockItem[] = [
    {
        id: 0,
        icon: { element: actionLockIcon, name: 'Lock' },
        caption: 'Open Source',
        captionBadge: { icon: OpenSourceIcon, caption: 'MIT License' },
        text: 'Open for contribution, actively evolving, supported, and used by 50+ EPAM production projects',
        footer: [
            { linkCaption: 'Figma Community', href: 'https://www.figma.com/community/file/1380452603479283689/epam-uui-v5-7', color: 'accent' },
            { linkCaption: 'Github', href: 'https://github.com/epam/UUI', color: 'accent' },
        ],
    }, {
        id: 1,
        icon: { element: notificationHelpIcon, name: 'Help' },
        caption: 'Support',
        captionBadge: null,
        text: 'Ongoing support during project live cycle. Access to a dedicated UUI team of architect, designers and developers on demand',
        footer: [
            { linkCaption: 'Contact Us', href: 'mailto:AskUUI@epam.com', color: 'primary' },
        ],
    },
];

export function ExploreBenefitsBlock() {
    const theme = getCurrentTheme();
    const getThemeClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    const topBlockRefs: React.RefObject<HTMLDivElement>[] = topExploreBlocks.map(() => React.createRef());
    const bottomBlockRefs: React.RefObject<HTMLDivElement>[] = bottomExploreBlocks.map(() => React.createRef());

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const direction = (entry.target as HTMLElement).dataset.direction;
                    entry.target.classList.add(css[`animatedSlideIn${direction}`]);
                    observer.unobserve(entry.target);
                }
            });
        });

        topBlockRefs.forEach((ref, index) => {
            ref.current.dataset.direction = index % 2 === 0 ? 'Left' : 'Right';
            observer.observe(ref.current);
        });

        bottomBlockRefs.forEach((ref) => {
            ref.current.dataset.direction = 'Up';
            observer.observe(ref.current);
        });

        return () => {
            topBlockRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });

            bottomBlockRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    return (
        <div className={ css.root }>
            <div className={ css.container }>
                <Text cx={ css.exploreHeader } fontWeight="600">Explore UUI benefits</Text>
                <div className={ css.topBlockWrapper }>
                    { topExploreBlocks.map((item, index) => (
                        <Panel ref={ topBlockRefs[index] } cx={ css.topBlockPanel } key={ item.id }>
                            <IconContainer icon={ item.icon.element } cx={ cx(css.topBlockIcon, css[getThemeClassName(`topBlockIcon${item.icon.name}`)]) } size="18" />
                            <FlexCell cx={ css.topBlockContextWrapper }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600">{ item.caption }</Text>
                                <Text fontSize="16" lineHeight="24" color="secondary">{ item.text }</Text>
                            </FlexCell>
                            { item.footer && (
                                <FlexRow cx={ css.topBlockFooter } justifyContent="center">
                                    <Button
                                        rawProps={ { style: { width: '100%' } } }
                                        fill="ghost"
                                        size="42"
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
                    { bottomExploreBlocks.map((item, index) => (
                        <Panel ref={ bottomBlockRefs[index] } cx={ css.bottomBlockPanel } key={ item.id }>
                            <IconContainer size="36" icon={ item.icon.element } cx={ cx(css.bottomBlockIcon, css[getThemeClassName(`bottomBlockIcon${item.icon.name}`)]) } />
                            <FlexRow cx={ css.bottomBlockCaptionWrapper }>
                                <Text fontSize="24" lineHeight="30" fontWeight="600" cx={ css.bottomBlockCaption }>{ item.caption }</Text>
                                { item.captionBadge
                                && <Badge color="success" fill="outline" size="24" cx={ css.bottomItemBadge } icon={ item.captionBadge.icon } caption={ item.captionBadge.caption } /> }
                            </FlexRow>
                            <Text fontSize="18" lineHeight="24" cx={ css.bottomBlockText } color="secondary">{ item.text }</Text>
                            { item.footer && (
                                <FlexRow cx={ css.bottomBlockFooter } columnGap="6">
                                    { item.footer.map((footerItem) => (
                                        <Button
                                            key={ footerItem.linkCaption }
                                            size="42"
                                            icon={ index === 1 && CommunicationMailFillIcon }
                                            href={ footerItem.href }
                                            fill={ index === 1 ? 'solid' : 'none' }
                                            target="_blank"
                                            color={ footerItem.color }
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
