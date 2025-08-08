import React, { useEffect, useMemo } from 'react';
import { useScrollSpy } from '@epam/uui-components';
import { FlexSpacer, Button, FlexCell, FlexRow, LinkButton, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Panel, ScrollBars, Text } from '@epam/promo';
import css from './ScrollSpyReader.module.scss';
import { svc } from '../../services';

export function ScrollSpyModal() {
    const links = useMemo(
        () => [{ id: 'a', caption: 'First' }, { id: 'b', caption: 'Second' }],
        [],
    );

    const { scrollToElement, currentActive, setRef } = useScrollSpy({ elements: ['a', 'b'] });

    const getContinuationModal = () => {
        svc.uuiModals
            .show((modalProps) => (
                <ModalBlocker { ...modalProps }>
                    <ModalWindow>
                        <Panel background="white">
                            <ModalHeader title="Continue reading? " onClose={ () => modalProps.abort() } />
                            <ScrollBars hasTopShadow hasBottomShadow>
                                <FlexRow padding="24">
                                    <Text size="36">Would you like to continue reading from the place you previously stopped?</Text>
                                </FlexRow>
                            </ScrollBars>
                            <ModalFooter>
                                <FlexSpacer />
                                <Button color="secondary" fill="white" caption="Cancel" onClick={ () => modalProps.abort() } />
                                <Button
                                    color="primary"
                                    caption="Ok"
                                    onClick={ () => {
                                        scrollToElement('b');
                                        setTimeout(() => modalProps.abort(), 1000);
                                    } }
                                />
                            </ModalFooter>
                        </Panel>
                    </ModalWindow>
                </ModalBlocker>
            ))
            .catch(() => null);
    };

    useEffect(getContinuationModal, []);

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
