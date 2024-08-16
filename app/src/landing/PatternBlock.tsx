import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, LinkButton, ProgressBar, Text } from '@epam/uui';
import { getCurrentTheme } from '../helpers';
import cx from 'classnames';
import { ReactComponent as NavigationChevronRightOutlineIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { ReactComponent as ActionExternalLinkOutlineIcon } from '@epam/assets/icons/action-external_link-outline.svg';
import css from './PatternBlock.module.scss';

const accordionData = [
    { id: 0, title: 'Data Tables', text: 'Data Table with advanced filtering, including predicates and user-defined presets. Built on top of the useTableState hook enables filter state management, with the ability to store states in the URL or a database, and supports CRUD operations.', href: '/demo?id=filteredTable&page=1&pageSize=40&presetId=-1' },
    { id: 1, title: 'Project Planning', text: 'Project planning table built on top of tables editing capabilities. Demo highlights in-cell inputs, drag-n-drop, tree-structured data, Timeline and more.', href: '/demo?id=editableTable' },
    { id: 2, title: 'Forms', text: 'Full-featured set of form components – Text Inputs, Date Pickers, Selects, etc. Form state management with useForm hook – to manage form state, including validation, undo/redo etc.', href: '/demo?id=form' },
    { id: 3, title: 'Rich Text Editor', text: 'Powerful RTE component with rich set of features, from base text formating to tables and media inserting. Extendable with plugins. Supports Markdown and HTML formats.', href: '/demo?id=RTE' },
    { id: 4, title: 'Drag & Drop', text: 'Built-in Drag & Drop facilities with cross browser and mobile support.', href: '/demo?id=dnd' },
];

const ACCORDION_INTERVAL = 5000;

export function PatternBlock() {
    const theme = getCurrentTheme();
    const [accordionValue, setAccordionValue] = useState(0);
    const [progress, setProgress] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeHoverId, setActiveHoverId] = useState<number | null>(null);
    const progressID = useRef(null);

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
                        if (prevValue === accordionData.length - 1) {
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
        } else if (windowWidth <= 768 && progressID.current) {
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

    const getSlide = () => {
        switch (accordionValue) {
            case 0: {
                return theme === 'loveship_dark' ? css.tablesDark : css.tablesLight;
            } case 1: {
                return theme === 'loveship_dark' ? css.projectPlaningDark : css.projectPlaningLight;
            } case 2: {
                return theme === 'loveship_dark' ? css.formsDark : css.formsLight;
            } case 3: {
                return theme === 'loveship_dark' ? css.rteDark : css.rteLight;
            } case 4: {
                return theme === 'loveship_dark' ? css.visualDark : css.visualLight;
            }
            default: {
                return theme === 'loveship_dark' ? css.tablesDark : css.tablesLight;
            }
        }
    };

    return (
        <div className={ css.root }>
            <FlexRow justifyContent="center" cx={ css.headerWrapper }>
                <Text cx={ css.header }>
                    <span className={ cx(css.headerStart, css[getHeaderClassName('headerStart')]) }>Find solution for </span>
                    <span className={ css.brake }><br /></span>
                    <span className={ cx(css.headerEnd, css[getHeaderClassName('headerEnd')]) }>your project</span>
                </Text>
            </FlexRow>
            <FlexRow cx={ css.container } alignItems="top">
                <div className={ css.startContainer }>
                    { accordionData.map((item) => (
                        <div
                            key={ item.id }
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
                                <LinkButton
                                    href={ item.href }
                                    caption="Open Example"
                                    icon={ ActionExternalLinkOutlineIcon }
                                    iconPosition="right"
                                    size="42"
                                    onClick={ () => {
                                    } }
                                />
                                <div className={ cx(css.slide, css.mobileSlide, getSlide()) }></div>
                            </Accordion>
                        </div>
                    )) }
                    <FlexSpacer />
                    <FlexCell width="auto" cx={ css.watchAllBtn }>
                        <Button
                            href="/demo"
                            caption="Watch all"
                            icon={ NavigationChevronRightOutlineIcon }
                            iconPosition="right"
                            fill="none"
                            size="42"
                            onClick={ () => {
                            } }
                        />
                    </FlexCell>
                </div>
                <div className={ cx(css.slide, getSlide()) }></div>
            </FlexRow>
        </div>
    );
}
