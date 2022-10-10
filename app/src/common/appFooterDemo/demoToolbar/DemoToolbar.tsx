import * as css from './DemoToolbar.scss';
import * as React from "react";
import { useHistory } from 'react-router';
import { LinkButton, FlexRow, FlexCell } from "@epam/promo";
import { DemoItem } from "../../../demo/structure";
import { ReactComponent as BackIcon } from '@epam/assets/icons/common/navigation-back-18.svg';
import { ReactComponent as ExternalLinkIcon } from '@epam/assets/icons/common/action-external_link-18.svg';
import { ReactComponent as FullScreenIcon } from '@epam/assets/icons/common/media-fullscreen-18.svg';
import { analyticsEvents } from "../../../analyticsEvents";

interface AppFooterContentDemoProps {
    demoItem: DemoItem;
    isFullScreenSupported: boolean;
    onOpenFullScreen: () => void;
}
export function DemoToolbar(props: AppFooterContentDemoProps) {
    const {
        demoItem,
        onOpenFullScreen,
        isFullScreenSupported,
    } = props;

    const routerHistory = useHistory();
    const handleBack = React.useCallback(() => {
        routerHistory.push('/demo');
    }, []);

    const renderDivider = () => (
        <FlexCell width="auto">
            <div className={ css.divider } />
        </FlexCell>
    );

    return (
        <FlexRow cx={ css.container }>
            <LinkButton cx={ css.item } icon={ BackIcon } caption='Back to demos' onClick={ handleBack }/>
            { renderDivider() }
            <LinkButton cx={ css.item }
                        icon={ ExternalLinkIcon }
                        caption='View Source Code'
                        target="_blank"
                        href={ demoItem.source }
                        clickAnalyticsEvent={ analyticsEvents.demo.scenarioGit(demoItem.source) }
            />
            { isFullScreenSupported && renderDivider() }
            { isFullScreenSupported && <LinkButton cx={ css.item } icon={ FullScreenIcon } caption='Fullscreen' onClick={ onOpenFullScreen }/> }
        </FlexRow>
    );
}
