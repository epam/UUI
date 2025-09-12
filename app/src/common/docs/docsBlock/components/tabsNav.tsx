import React, { useEffect, useState } from 'react';
import { Button, FlexRow, FlexSpacer, Tabs, type TabsItemProps } from '@epam/uui';
import { TMode } from '../../docsConstants';
import { ReactComponent as NavigationShowOutlineIcon } from '@epam/assets/icons/navigation-show-outline.svg';
import css from './tabsNav.module.scss';

type TTabsNavProps = {
    mode: TMode;
    supportedModes: TMode[];
    onChangeMode: (mode: TMode) => void;
    renderSkinSwitcher: () => React.ReactNode;
    handleMobSidebarBtnClick: () => void;
};

type TabType = {
    caption: string,
    tooltip: string,
};

export function TabsNav(props: TTabsNavProps) {
    const { mode, onChangeMode, supportedModes, renderSkinSwitcher } = props;
    const [pageWidth, setPageWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setPageWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const allTabs: Partial<Record<TMode, TabType>> = {
        [TMode.doc]: {
            caption: 'Documentation',
            tooltip: '',
        },
    };

    if (supportedModes.length > 1) {
        allTabs[TMode.propsEditor] = {
            caption: 'Property Explorer',
            tooltip: '',
        };
    }

    if (Object.keys(allTabs).length <= 1) {
        return;
    }

    return (
        <FlexRow
            padding="12"
            cx={ [css.secondaryNavigation] }
            borderBottom
        >
            { pageWidth <= 768 && (
                <Button
                    fill="none"
                    icon={ NavigationShowOutlineIcon }
                    onClick={ props.handleMobSidebarBtnClick }
                    size="42"
                    cx={ css.mobSidebarBtn }
                >
                </Button>
            ) }

            <Tabs
                value={ mode }
                onValueChange={ (modeNext: TMode) => {
                    onChangeMode(modeNext);
                } }
                items={
                    Object.keys(allTabs).reduce<TabsItemProps[]>((acc, tm) => {
                        if (supportedModes.includes(tm as TMode) || (tm as TMode) === mode) {
                            const data = allTabs[tm as TMode];

                            acc.push({
                                id: tm,
                                size: '60',
                                caption: data.caption,
                                rawProps: { title: data.tooltip },
                            });
                        }
                        return acc;
                    }, [])
                }
                borderBottom={ false }
            />
            <FlexSpacer />
            { renderSkinSwitcher() }
        </FlexRow>
    );
}
