import React, { useEffect, useRef, useState } from 'react';
import { Accordion, FlexCell, FlexRow, ProgressBar, Text } from '@epam/uui';
import css from './PatternBlock.module.scss';

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
    const intervalID = useRef(null);
    const timeoutID = useRef(null);

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

        return () => {
            clearInterval(intervalID.current);
            clearTimeout(timeoutID.current);
        };
    }, []);

    const onClickHandler = (id: number) => {
        setAccordionValue(id);
        clearInterval(intervalID.current);
        clearTimeout(timeoutID.current);
        timeoutID.current = setTimeout(() => {
            startInterval();
        }, VIEW_TIMEOUT);
    };

    const getProgress = () => parseInt(String(Math.min((100 / 6) * (accordionValue + 1), 100)));

    return (
        <div className={ css.root }>
            <FlexRow cx={ css.container }>
                <FlexCell width={ 452 } cx={ css.startContainer }>
                    <ProgressBar cx={ css.progress } progress={ getProgress() } hideLabel />
                    {accordionData.map((item) => (
                        <Accordion title={ item.title } mode="block" value={ item.id === accordionValue } onValueChange={ () => onClickHandler(item.id) }>
                            <Text>{ item.text }</Text>
                        </Accordion>
                    ))}
                </FlexCell>
            </FlexRow>
        </div>
    );
}
