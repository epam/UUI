import React, { useMemo } from 'react';
import { useScrollSpy } from '@epam/uui-components';
import {
    FlexCell, FlexRow, LinkButton, Text,
} from '@epam/promo';
import css from './ScrollSpyReader.module.scss';

export function ScrollSpyAnchor() {
    const links = useMemo(
        () => [{ id: 'a', caption: 'First' }, { id: 'b', caption: 'Second' }],
        [],
    );

    const { scrollToElement, currentActive, setRef } = useScrollSpy({ elements: ['a', 'b'] });

    return (
        <FlexRow>
            <FlexCell grow={ 2 } alignSelf="start" cx={ css.menu } textAlign="center">
                {links.map((link) => (
                    <LinkButton
                        isActive={ currentActive === link.id }
                        key={ link.id }
                        cx={ css.spyLink }
                        onClick={ () => scrollToElement(link.id) }
                        caption={ link.caption }
                        href={ `#${link.id}` }
                    />
                ))}
            </FlexCell>
            <FlexCell grow={ 5 }>
                <section ref={ setRef }>
                    <Text size="48" cx={ css.content } lineHeight="30">
                        <Text rawProps={ { 'data-spy': 'a' } } cx={ css.header } color="gray90">
                            Section 1
                        </Text>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates veritatis laborum, dolores atque, quos soluta nisi delectus placeat id
                        dolor consectetur quas optio vero possimus quae accusamus rerum quod! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates
                        veritatis laborum, dolores atque, quos soluta nisi delectus placeat id dolor consectetur quas optio vero possimus quae accusamus rerum quod!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates veritatis laborum, dolores atque, quos soluta nisi delectus placeat id
                        dolor consectetur quas optio vero possimus quae accusamus rerum quod! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates
                        veritatis laborum, dolores atque, quos soluta nisi delectus placeat id dolor consectetur quas optio vero possimus quae accusamus rerum quod!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates veritatis laborum, dolores atque, quos soluta nisi delectus placeat id
                        dolor consectetur quas optio vero possimus quae accusamus rerum quod! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates
                        veritatis laborum, dolores atque, quos soluta nisi delectus placeat id dolor consectetur quas optio vero possimus quae accusamus rerum quod!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates veritatis laborum, dolores atque, quos soluta nisi delectus placeat id
                        dolor consectetur quas optio vero possimus quae accusamus rerum quod! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates
                        veritatis laborum, dolores atque, quos soluta nisi delectus placeat id dolor consectetur quas optio vero possimus quae accusamus rerum quod!
                        <Text rawProps={ { 'data-spy': 'b' } } cx={ css.header } color="gray90">
                            Section 2
                        </Text>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde voluptates veritatis laborum, dolores atque, quos soluta nisi delectus placeat id
                        dolor consectetur quas optio vero possimus quae accusamus rerum quod!
                    </Text>
                </section>
            </FlexCell>
        </FlexRow>
    );
}
