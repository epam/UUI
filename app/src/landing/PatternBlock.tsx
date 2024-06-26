import React, { useEffect, useRef, useState } from 'react';
import { Accordion, FlexRow, IconContainer, ProgressBar, Text } from '@epam/uui';
import css from './PatternBlock.module.scss';
import { ReactComponent as Banner } from '../icons/banner.svg';

const accordionData = [
    { id: 0, title: '01 Accordion Title', text: '01 Accordion Text' },
    { id: 1, title: '02 Accordion Title', text: '02 Accordion Text' },
    { id: 2, title: '03 Accordion Title', text: '03 Accordion Text' },
    { id: 3, title: '04 Accordion Title', text: '04 Accordion Text' },
    { id: 4, title: '05 Accordion Title', text: '05 Accordion Text' },
    { id: 5, title: '06 Accordion Title', text: '06 Accordion Text' },
];

const ACCORDION_INTERVAL = 4000;
const VIEW_TIMEOUT = 5000;

export function PatternBlock() {
    const [accordionValue, setAccordionValue] = useState(0);
    const [isIntersecting, setIntersecting] = useState(false);
    const intervalID = useRef(null);
    const timeoutID = useRef(null);
    const progressRef = useRef(null);

    const startInterval = () => {
        intervalID.current = setInterval(() => {
            setAccordionValue((prevValue) => {
                if (prevValue === 5) {
                    return 0;
                }
                return prevValue + 1;
            });
        }, ACCORDION_INTERVAL);
    };

    useEffect(() => {
        startInterval();

        const observer = new IntersectionObserver((entries) => {
            setIntersecting(entries[0].isIntersecting);
        });
        if (progressRef.current) observer.observe(progressRef.current);
        const currentRef = progressRef.current;

        return () => {
            clearInterval(intervalID.current);
            clearTimeout(timeoutID.current);
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    useEffect(() => {
        if (!isIntersecting) {
            clearInterval(intervalID.current);
            clearTimeout(timeoutID.current);
        } else {
            clearInterval(intervalID.current);
            clearTimeout(timeoutID.current);
            startInterval();
        }
    }, [isIntersecting]);

    const onClickHandler = (id: number) => {
        setAccordionValue(id);
        clearInterval(intervalID.current);
        clearTimeout(timeoutID.current);
        if (isIntersecting) {
            timeoutID.current = setTimeout(() => {
                startInterval();
            }, VIEW_TIMEOUT);
        }
    };

    const getProgress = () => parseInt(String(Math.min((100 / 6) * (accordionValue + 1), 100)));

    return (
        <div className={ css.root }>
            <FlexRow cx={ css.container } columnGap="24" alignItems="top">
                <div className={ css.startContainer }>
                    <ProgressBar ref={ progressRef } cx={ css.progress } progress={ getProgress() } hideLabel />
                    {accordionData.map((item) => (
                        <Accordion
                            title={ item.title }
                            mode="block"
                            value={ item.id === accordionValue }
                            onValueChange={ () => onClickHandler(item.id) }
                        >
                            <Text fontSize="16" lineHeight="24">{ item.text }</Text>
                        </Accordion>
                    ))}
                </div>
                <IconContainer icon={ Banner } cx={ css.banner } />
            </FlexRow>
        </div>
    );
}
