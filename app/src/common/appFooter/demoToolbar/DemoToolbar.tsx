import * as css from './DemoToolbar.scss';
import * as React from "react";
import { useHistory } from 'react-router';
import { LinkButton, FlexRow, FlexCell } from "@epam/promo";
import { DemoItem } from "../../../demo/structure";
import { ReactComponent as BackIcon } from '@epam/assets/icons/common/navigation-back-18.svg';
import { ReactComponent as ExternalLinkIcon } from '@epam/assets/icons/common/action-external_link-18.svg';
import { ReactComponent as FullScreenIcon } from '@epam/assets/icons/common/media-fullscreen-18.svg';
import { Divider } from "../../divider/Divider";
import { analyticsEvents } from "../../../analyticsEvents";
import { useContext } from "react";
import { PageContext } from "../../Page";

DemoToolbar.displayName = 'DemoToolbar';
interface AppFooterContentDemoProps {
    demoItem: DemoItem;
}
export function DemoToolbar(props: AppFooterContentDemoProps) {
    const {
        demoItem,
    } = props;
    const routerHistory = useHistory();
    const { fullScreenApi } = useContext(PageContext);

    const handleBack = React.useCallback(() => {
        routerHistory.push('/demo');
    }, []);
    const handleViewFullscreen = React.useCallback(() => {
        fullScreenApi.openFullScreen();
    }, []);

    const toolbar = {
        back:           <LinkButton cx={ css.item } icon={ BackIcon } caption='Back to demos' onClick={ handleBack }/>,
        code:           <LinkButton cx={ css.item }
                         icon={ ExternalLinkIcon }
                         caption='View Source Code'
                         target="_blank"
                         href={ demoItem.source }
                         clickAnalyticsEvent={ analyticsEvents.demo.scenarioGit(demoItem.source) }
                        />,
        ...(
            fullScreenApi.isSupported ?
            {
                fullScreen: <LinkButton cx={ css.item } icon={ FullScreenIcon } caption='Fullscreen' onClick={ handleViewFullscreen }/>,
            } :
            {}
        ),
    };

    const keys = Object.keys(toolbar) as [keyof typeof toolbar];
    const content = keys.reduce((acc, id, index, { length }) => {
        const isLast = index === length - 1;
        acc.push(
            <FlexCell width="auto" key={ id }>
                { toolbar[id] }
            </FlexCell>,
        );
        if (!isLast) {
            acc.push(
                <FlexCell width="auto" key={ `${id}_divider` }>
                    <Divider key={ `${id}_divider` } />
                </FlexCell>,
            );
        }

        return acc;
    }, []);


    return (
        <FlexRow cx={ css.container }>
            { content }
        </FlexRow>
    );
}
