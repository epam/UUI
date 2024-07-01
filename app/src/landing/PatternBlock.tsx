import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const ACCORDION_INTERVAL = 5000;

export function PatternBlock() {
    const [accordionValue, setAccordionValue] = useState(0);
    const [progress, setProgress] = useState(0);
    const progressID = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeHoverId, setActiveHoverId] = useState<number | null>(null);

    const stopInterval = () => {
        clearInterval(progressID.current);
        progressID.current = null;
    };

    const startProgress = () => {
        if (windowWidth <= 768 || progressID.current !== null) return;

        progressID.current = setInterval(() => {
            setProgress((prev) => {
                if (prev > 101) {
                    setAccordionValue((prevValue) => {
                        if (prevValue === 5) {
                            return 0;
                        }
                        return prevValue + 1;
                    });
                    return 0;
                }
                return prev + (100 / (ACCORDION_INTERVAL / 100));
            });
        }, 100);
    };

    useEffect(() => {
        !progressID.current && startProgress();

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => {
            stopInterval();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useLayoutEffect(() => {
        if (windowWidth > 768 && !progressID.current) {
            startProgress();
        } else if (windowWidth < 768 && progressID.current) {
            stopInterval();
            setProgress(0);
        }
    }, [windowWidth]);

    useEffect(() => {
        if (activeHoverId === accordionValue && progressID.current) {
            stopInterval();
        }
    }, [activeHoverId, accordionValue]);

    const onClickHandler = (id: number) => {
        progressID.current && stopInterval();
        if (accordionValue !== id) {
            setProgress(0);
            setAccordionValue(id);
        }
    };

    const onMouseEnterHandler = (itemId: number) => {
        setActiveHoverId(() => itemId);
        if (itemId === accordionValue && progressID.current) {
            stopInterval();
        }
    };

    const onMouseLeaveHandler = (itemId: number) => {
        setActiveHoverId(() => null);
        if (itemId === accordionValue && !progressID.current) {
            stopInterval();
            startProgress();
        }
    };

    return (
        <div className={ css.root }>
            <FlexRow cx={ css.container } alignItems="top">
                <div className={ css.startContainer }>
                    {accordionData.map((item) => (
                        <div
                            className={ css.accordionWrapper }
                            onMouseEnter={ () => onMouseEnterHandler(item.id) }
                            onMouseLeave={ () => onMouseLeaveHandler(item.id) }
                        >
                            { item.id === accordionValue && <ProgressBar cx={ css.progress } progress={ progress } hideLabel /> }
                            <Accordion
                                title={ item.title }
                                mode="block"
                                value={ item.id === accordionValue }
                                onValueChange={ () => onClickHandler(item.id) }
                            >
                                <Text fontSize="16" lineHeight="24">{ item.text }</Text>
                            </Accordion>
                        </div>
                    ))}
                </div>
                <IconContainer icon={ Banner } cx={ css.banner } />
            </FlexRow>
        </div>
    );
}
