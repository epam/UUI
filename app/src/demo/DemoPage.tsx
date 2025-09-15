import * as React from 'react';
import { ScrollBars } from '@epam/uui';
import { AppHeader, Page } from '../common';
import { svc } from '../services';
import { demoItems } from './structure';
import { analyticsEvents } from '../analyticsEvents';
import { getQuery } from '../helpers';
import css from './DemoPage.module.scss';
import { useEffect } from 'react';
import { useFullScreenApi } from '../common/services/useFullScreenApi';
import { AppFooterDemo } from '../common/appFooterDemo/AppFooterDemo';
import { DemoItemCard } from './demoItemCard/DemoItemCard';

function getSelectedDemoItem() {
    const selectedDemoId = getQuery('id');
    return demoItems.find((i) => i.id === selectedDemoId);
}
function sendEvent(name: string) {
    svc.uuiAnalytics.sendEvent(analyticsEvents.demo.scenarioSelect(name));
}

export function DemoPage() {
    const demoItem = getSelectedDemoItem();
    const selectedDemoId = demoItem?.id;
    const isDemoSelected = Boolean(selectedDemoId);
    const fullScreenApi = useFullScreenApi();

    useEffect(() => {
        const demoName = demoItem?.name;
        document.title = demoName ? `${demoName} | UUI` : 'Demo | UUI';
    }, [demoItem?.name]);

    useEffect(() => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.demo.pv(selectedDemoId));
    }, [selectedDemoId]);

    useEffect(() => {
        if (!isDemoSelected) {
            fullScreenApi.closeFullScreen();
        }
    }, [isDemoSelected]);

    const renderFooter = React.useCallback(() => {
        if (demoItem) {
            return <AppFooterDemo demoItem={ demoItem } isFullScreenSupported={ fullScreenApi.isSupported } onOpenFullScreen={ fullScreenApi.openFullScreen } />;
        }
        return null;
    }, [
        demoItem, fullScreenApi.isSupported, fullScreenApi.openFullScreen,
    ]);

    const renderHeader = React.useCallback(() => {
        return <AppHeader />;
    }, []);

    let pageContent;
    if (demoItem) {
        pageContent = (
            <ScrollBars>
                {' '}
                {React.createElement(demoItem.component)}
                {' '}
            </ScrollBars>
        );
    } else {
        pageContent = (
            <ScrollBars>
                <div className={ css.navPage }>
                    <div className={ css.navTitle }>Demo</div>
                    <div className={ css.navCards }>
                        {demoItems.map((item) => {
                            return <DemoItemCard demoItem={ item } key={ item.id } onOpenItem={ sendEvent } />;
                        })}
                    </div>
                </div>
            </ScrollBars>
        );
    }

    return (
        <Page contentCx={ css.root } renderHeader={ renderHeader } renderFooter={ renderFooter } isFullScreen={ fullScreenApi.isFullScreen }>
            {pageContent}
        </Page>
    );
}
