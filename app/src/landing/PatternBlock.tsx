import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, IconContainer, LinkButton, ProgressBar, Text } from '@epam/uui';
import cx from 'classnames';
import css from './PatternBlock.module.scss';
import { ReactComponent as Banner } from '../icons/banner.svg';
import { ReactComponent as NavigationChevronRightOutlineIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { ReactComponent as ActionExternalLinkOutlineIcon } from '@epam/assets/icons/action-external_link-outline.svg';
import { getCurrentTheme } from '../helpers';

const accordionData = [
    { id: 0, title: 'Filtered Table', text: 'Shows support for advanced filter toolbar – including predicates (in/not in/less/greater than), and user-defined filter presets (tabs).' },
    { id: 1, title: 'Project Planning', text: 'Project Planning Text' },
    { id: 2, title: 'Forms', text: 'Forms Text' },
    { id: 3, title: 'Text Editor', text: 'Text Editor Text' },
    { id: 4, title: 'Drag and Drop', text: 'Drag and Drop Text' },
    { id: 5, title: 'Timeline', text: 'Timeline Text' },
];

const ACCORDION_INTERVAL = 5000;

export function PatternBlock() {
    const theme = getCurrentTheme();
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

    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;

    return (
        <div className={ css.root }>
            <FlexRow justifyContent="center" cx={ css.headerWrapper }>
                <Text cx={ css.header }>
                    <span className={ cx(css.headerStart, css[getHeaderClassName('headerStart')]) }>Find pattern for </span>
                    <span className={ cx(css.headerEnd, css[getHeaderClassName('headerEnd')]) }>your project</span>
                </Text>
            </FlexRow>
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
                                <LinkButton href="/" caption="Open Example" icon={ ActionExternalLinkOutlineIcon } iconPosition="right" size="42" onClick={ () => {} } />
                            </Accordion>
                        </div>
                    ))}
                    <FlexSpacer />
                    <FlexCell width="auto" cx={ css.watchAllBtn }>
                        <Button href="/" caption="Watch all" icon={ NavigationChevronRightOutlineIcon } iconPosition="right" fill="none" size="42" onClick={ () => {} } />
                    </FlexCell>
                </div>
                <IconContainer icon={ Banner } cx={ css.banner } />
            </FlexRow>
        </div>
    );
}
