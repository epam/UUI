import * as React from 'react';
import {
    LinkButton, FlexRow, FlexCell, SuccessNotification, Text,
} from '@epam/uui';
import { DemoItem } from '../../../demo/structure';
import { ReactComponent as BackIcon } from '@epam/assets/icons/common/navigation-back-18.svg';
import { ReactComponent as ExternalLinkIcon } from '@epam/assets/icons/common/action-external_link-18.svg';
import { ReactComponent as FullScreenIcon } from '@epam/assets/icons/common/media-fullscreen-18.svg';
import { ReactComponent as DescriptionIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import { analyticsEvents } from '../../../analyticsEvents';
import { INotification, useUuiContext } from '@epam/uui-core';
import css from './DemoToolbar.module.scss';
import { svc } from '../../../services';
import { DescriptionModal } from './DescriptionModal';
import { EditorValue } from '@epam/uui-editor';

interface AppFooterContentDemoProps {
    demoItem: DemoItem;
    isFullScreenSupported: boolean;
    onOpenFullScreen: () => void;
}

export function DemoToolbar(props: AppFooterContentDemoProps) {
    const { demoItem, onOpenFullScreen, isFullScreenSupported } = props;

    const { uuiRouter } = useUuiContext();

    const handleBack = React.useCallback(() => {
        uuiRouter.redirect('/demo');
    }, [uuiRouter]);

    const renderDivider = () => (
        <FlexCell width="auto">
            <div className={ css.divider } />
        </FlexCell>
    );

    const svcContext = useUuiContext();
    const showSuccess = async () => {
        return svcContext.uuiNotifications
            .show(
                (props: INotification) => (
                    <SuccessNotification { ...props }>
                        <Text fontSize="14">
                            Description has been updated.
                        </Text>
                    </SuccessNotification>
                ),
                { position: 'bot-left', duration: 1 },
            );
    };

    async function saveDocContentByDemoName(demoItemName: string, content: EditorValue) {
        const itemNameNormalized = demoItemName.replace(/\s/g, '');

        const docFileName = `demo-${itemNameNormalized}-description`;
        await svc.uuiApi.processRequest('/api/save-doc-content', 'POST', {
            name: docFileName,
            content: content || null,
        }).then(() => { showSuccess().catch(() => {}); });
    }

    function getDemoDescriptionFileName(demoItemName: string) {
        const itemNameNormalized = demoItemName.replace(/\s/g, '');
        return `demo-${itemNameNormalized}-description`;
    }

    async function loadDocContentByDemoName(demoItemName: string) {
        const docFileName = getDemoDescriptionFileName(demoItemName);
        const res = await svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: docFileName });
        return res.content;
    }

    const openModal = async () => {
        const content = await loadDocContentByDemoName(demoItem.name);
        svc.uuiModals.show<EditorValue>((props) =>
            <DescriptionModal demoItemName={ demoItem.name } modalProps={ props } value={ content } />).then((newContent) => {
            saveDocContentByDemoName(demoItem.name, newContent as EditorValue);
        }).catch(() => {});
    };

    return (
        <FlexRow cx={ css.container }>
            <LinkButton cx={ css.item } icon={ BackIcon } caption="Back to demos" onClick={ handleBack } />
            {renderDivider()}
            <LinkButton cx={ css.item } icon={ DescriptionIcon } caption="Description" onClick={ openModal } />
            {renderDivider()}
            <LinkButton
                cx={ css.item }
                icon={ ExternalLinkIcon }
                caption="View Source Code"
                target="_blank"
                href={ demoItem.source }
                clickAnalyticsEvent={ analyticsEvents.demo.scenarioGit(demoItem.source) }
            />
            {isFullScreenSupported && renderDivider()}
            {isFullScreenSupported && <LinkButton cx={ css.item } icon={ FullScreenIcon } caption="Fullscreen" onClick={ onOpenFullScreen } />}
        </FlexRow>
    );
}
