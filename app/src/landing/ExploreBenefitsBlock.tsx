import React, { FC, SVGProps } from 'react';
import { Badge, Button, FlexRow, IconContainer, LinkButton, Panel, Text, ButtonProps, Anchor } from '@epam/uui';
import css from './ExploreBenefitsBlock.module.scss';
import { ReactComponent as ActionAccountFillIcon } from '@epam/assets/icons/action-account-fill.svg';

interface IExploreTopBlockItem {
    id: number,
    icon: FC<SVGProps<SVGSVGElement>>,
    caption: string,
    text: string,
    footer: null | { linkCaption: string, href: string }
}

const topExploreBlocks: IExploreTopBlockItem[] = [
    { id: 0, icon: ActionAccountFillIcon, caption: 'Figma components aligned with React', text: 'Guidelines, examples, do/don’s recommendations and many other useful guides for designer and developer', footer: null },
    { id: 1, icon: ActionAccountFillIcon, caption: 'Integrated solutions & front-end accelerating facilities', text: 'Common services, state-management primitives: Forms with validation, Lists and Tables with lazy-loading', footer: null },
    { id: 2, icon: ActionAccountFillIcon, caption: '60+ rich components', text: 'Rich set of components: from buttons to data tables, that meets WCAG 2.0 Level AA conformance', footer: { linkCaption: 'See components', href: '/' } },
    {
        id: 3,
        icon: ActionAccountFillIcon,
        caption: 'Themization',
        // eslint-disable-next-line no-multi-str
        text: 'Easy to create and support your own brand theme. Allows deep customization to build your own brand UI components set on top',
        footer: { linkCaption: 'Open builder', href: '/' },
    },
];

interface IExploreBottomBlockItem {
    id: number,
    icon: FC<SVGProps<SVGSVGElement>>,
    caption: string,
    captionBadge: null | { icon: FC<SVGProps<SVGSVGElement>>, caption: string },
    text: string,
    footer: null | { linkCaption: string, href: string, color: ButtonProps['color'] }[]
}

const bottomExploreBlocks: IExploreBottomBlockItem[] = [
    {
        id: 0,
        icon: ActionAccountFillIcon,
        caption: 'Open Source',
        captionBadge: { icon: ActionAccountFillIcon, caption: 'MIT License' },
        text: 'Open for contribution, actively evolving, supported, and used by 40+ EPAM internal production projects',
        footer: [
            { linkCaption: 'Figma Community', href: '/', color: 'accent' },
            { linkCaption: 'Github', href: '/', color: 'accent' },
        ],
    }, {
        id: 1,
        icon: ActionAccountFillIcon,
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
            <Text cx={ css.exploreHeader } fontWeight="600">Explore UUI benefits</Text>
            <div className={ css.topBlockWrapper }>
                { topExploreBlocks.map((item) => (
                    <Panel cx={ css.topBlockPanel }>
                        <IconContainer icon={ item.icon } cx={ css.topBlockIcon } />
                        <Text fontWeight="600" cx={ css.topBlockCaption }>{ item.caption }</Text>
                        <Text cx={ css.topBlockText }>{ item.text }</Text>
                        { item.footer && (
                            <FlexRow cx={ css.topBlockFooter } justifyContent="center">
                                <LinkButton caption={ item.footer.linkCaption } />
                            </FlexRow>
                        ) }
                    </Panel>
                )) }
            </div>
            <div className={ css.bottomBlockWrapper }>
                { bottomExploreBlocks.map((item) => (
                    <Panel cx={ css.bottomBlockPanel }>
                        <IconContainer icon={ item.icon } cx={ css.bottomBlockIcon } />
                        <FlexRow cx={ css.bottomBlockCaptionWrapper }>
                            <Text fontWeight="600" cx={ css.bottomBlockCaption }>{ item.caption }</Text>
                            { item.captionBadge
                                && <Badge color="success" fill="outline" size="24" cx={ css.bottomItemBadge } icon={ item.captionBadge.icon } caption={ item.captionBadge.caption } /> }

                        </FlexRow>
                        <Text cx={ css.bottomBlockText }>{ item.text }</Text>
                        { item.footer && (
                            <FlexRow cx={ css.bottomBlockFooter } columnGap="6">
                                { item.footer.map((footerItem) => (
                                    <Anchor href="/">
                                        <Button color={ footerItem.color } fill="none" caption={ footerItem.linkCaption } onClick={ () => {} } /> 
                                    </Anchor>
                                )) }
                            </FlexRow>
                        ) }
                    </Panel>
                )) }
            </div>
        </div>
    );
}
