import React, { useRef, useState, useEffect } from 'react';
import { FlexCell, FlexRow, FlexSpacer, IconContainer, RichTextView, Text } from '@epam/uui';
import { svc } from '../../../services';
import { analyticsEvents } from '../../../analyticsEvents';
import { TMode } from '../docsConstants';
import { DocTab } from './tabs/docTab';
import { PropExplorerTab } from './tabs/propExplorerTab';
import { TabsNav } from './components/tabsNav';
import { SkinModeToggler } from './components/skinModeToggler';
import { QueryHelpers } from './utils/queryHelpers';
import { ReactComponent as NavigationHideOutlineIcon } from '@epam/assets/icons/navigation-hide-outline.svg';
import { DocsSidebar } from '../DocsSidebar';
import cx from 'classnames';
import css from './DocsBlock.module.scss';
import { DocItem } from '@epam/uui-docs';
import { DocExample } from '../DocExample';
import { EditableDocContent } from '../EditableDocContent';
import { explorerConfigsMap } from '../../../docs/explorerConfigs/_explorerConfigsSet';

interface DocBlockProps {
    docItem?: DocItem;
}

export const DocsBlock: React.FC<DocBlockProps> = (props) => {
    const { docItem } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));
    }, []);

    useEffect(() => {
        redirectIfModeIsUnsupported();
    }, []);

    useEffect(() => {
        return () => {
            containerRef.current?.removeEventListener('animationend', animationHandler);
        };
    }, []);

    const getConfig = () => {
        return explorerConfigsMap.get(docItem?.id);
    };

    const isModeSupported = (mode: TMode) => {
        if ([TMode.propsEditor].includes(mode)) {
            return !!getConfig()?.contexts;
        }
        return true;
    };

    const renderSkinSwitcher = () => {
        const mode = QueryHelpers.getMode();
        const isSkin = QueryHelpers.isSkin();
        const theme = QueryHelpers.getTheme();
        return (
            <SkinModeToggler
                mode={ mode }
                theme={ theme }
                isSkinEnabled={ isSkin }
                onToggleSkin={ QueryHelpers.toggleSkinMode }
            />
        );
    };

    const renderSectionTitle = (sectionTitle: string) => {
        return (
            <RichTextView>
                <h2>{sectionTitle}</h2>
            </RichTextView>
        );
    };

    const renderContent = () => {
        if (docItem?.renderContent) {
            return docItem.renderContent();
        }

        const theme = QueryHelpers.getTheme();
        const result: React.ReactNode[] = [];

        if (docItem?.examples) {
            docItem.examples.forEach((example) => {
                if (example.themes?.length > 0 && !example.themes.includes(theme)) {
                    return; // Skip example if it is not applicable for the current theme
                }

                if (example.componentPath) {
                    result.push(
                        <DocExample
                            key={ example.componentPath }
                            config={ getConfig() }
                            title={ example.name }
                            path={ example.componentPath }
                            onlyCode={ example.onlyCode }
                            cx={ example.cx }
                        />,
                    );
                } else if (example.descriptionPath) {
                    result.push(
                        <EditableDocContent 
                            key={ example.descriptionPath }
                            title={ example.name } 
                            fileName={ example.descriptionPath } 
                        />,
                    );
                }
            });
        }

        return result;
    };

    const renderTabContent = (mode: TMode) => {
        const isSkin = QueryHelpers.isSkin();
        const theme = QueryHelpers.getTheme();

        switch (mode) {
            case TMode.doc: {
                return (
                    <DocTab
                        title={ docItem?.name }
                        config={ getConfig() }
                        renderSectionTitle={ (titleText) => renderSectionTitle(titleText) }
                        renderContent={ () => renderContent() }
                    />
                );
            }
            case TMode.propsEditor: {
                return (
                    <PropExplorerTab
                        title={ docItem?.name }
                        config={ getConfig() }
                        isSkin={ isSkin }
                        theme={ theme }
                        onOpenDocTab={ () => QueryHelpers.changeTab(TMode.doc) }
                    />
                );
            }
            default: {
                return null;
            }
        }
    };

    const redirectIfModeIsUnsupported = () => {
        const mode = QueryHelpers.getMode();
        if (!isModeSupported(mode)) {
            QueryHelpers.changeTab(TMode.doc);
        }
    };

    const handleChangeTab = (mode: TMode) => {
        return QueryHelpers.changeTab(mode);
    };

    const animationHandler = () => {
        setIsOpen(false);
        setIsClosing(false);
    };

    const handleMobSidebarBtnClick = () => {
        if (isOpen) {
            setIsClosing(true);
            containerRef.current?.addEventListener('animationend', animationHandler, { once: true });
        } else {
            containerRef.current?.removeEventListener('animationend', animationHandler);
            setIsOpen(true);
        }
    };

    const mode = QueryHelpers.getMode();
    const supportedModes = Object.values(TMode).filter((m) => isModeSupported(m));

    return (
        <div
            ref={ containerRef }
            className={ css.container }
        >
            <TabsNav
                mode={ mode }
                supportedModes={ supportedModes }
                renderSkinSwitcher={ renderSkinSwitcher }
                onChangeMode={ handleChangeTab }
                handleMobSidebarBtnClick={ handleMobSidebarBtnClick }
            />
            {renderTabContent(mode)}
            {isOpen && (
                <FlexCell grow={ 1 } cx={ cx(css.sidebarWrapper, isOpen && css.mobile, isClosing && css.closing) }>
                    <FlexRow borderBottom={ true } padding="18" vPadding="24">
                        <Text fontSize="18" fontWeight="600" lineHeight="24">Navigation</Text>
                        <FlexSpacer />
                        <IconContainer
                            size={ 24 }
                            icon={ NavigationHideOutlineIcon }
                            onClick={ handleMobSidebarBtnClick }
                            style={ { fill: '#6C6F80' } }
                        />
                    </FlexRow>
                    <FlexRow borderBottom={ true } alignItems="stretch" cx={ css.sidebar }>
                        <DocsSidebar />
                    </FlexRow>
                </FlexCell>
            )}
        </div>
    );
};
