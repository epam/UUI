import React, { useMemo } from 'react';
import { useScrollSpy } from '@epam/uui-components';
import { FlexCell, FlexRow, LinkButton, Text } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicScrollSpy() {
    const links = useMemo(
        () => [{ id: 'a', caption: 'First' }, { id: 'b', caption: 'Second' }],
        [],
    );

    const { scrollToElement, currentActive, setRef } = useScrollSpy({ elements: ['a', 'b'] });

    return (
        <FlexRow cx={ css.container }>
            <FlexCell alignSelf="start" cx={ css.menu } grow={ 1 }>
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
            <FlexCell grow={ 4 }>
                <section ref={ setRef }>
                    <Text size="48" cx={ css.content } lineHeight="30">
                        <Text rawProps={ { 'data-spy': 'a' } } cx={ css.header } color="primary">
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
                        <Text rawProps={ { 'data-spy': 'b' } } cx={ css.header } color="primary">
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
