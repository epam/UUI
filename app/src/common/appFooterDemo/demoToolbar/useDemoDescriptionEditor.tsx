import { svc } from '../../../services';
import { INotification, useUuiContext } from '@epam/uui-core';
import { SuccessNotification, Text } from '@epam/promo';
import * as React from 'react';
import { DescriptionModal } from './DescriptionModal';

function getDemoDescriptionFileName(demoItemName: string) {
    const itemNameNormalized = demoItemName.replace(/\s/g, '');
    return `demo-${itemNameNormalized}-description`;
}

export async function loadDocContentByDemoName(demoItemName: string) {
    const docFileName = getDemoDescriptionFileName(demoItemName);
    const res = await svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: docFileName });
    return res.content; // && Value.fromJSON(res.content);
}
async function saveDocContentByDemoName(demoItemName: string, content: any) {
    const docFileName = getDemoDescriptionFileName(demoItemName);
    await svc.uuiApi.processRequest('/api/save-doc-content', 'POST', {
        name: docFileName,
        content: content?.toJSON() || null,
    });
}

export function useDemoDescriptionEditor(demoItemName: string) {
    const svcContext = useUuiContext();
    const showSuccess = async () => {
        return svcContext.uuiNotifications
            .show(
                (props: INotification) => (
                    <SuccessNotification { ...props }>
                        <Text size="36" fontSize="14">
                            Description has been updated.
                        </Text>
                    </SuccessNotification>
                ),
                { position: 'bot-left', duration: 1 },
            );
    };

    const openModal = React.useCallback(async () => {
        try {
            const content = await loadDocContentByDemoName(demoItemName);
            const newContent = await svc.uuiModals.show((props) => <DescriptionModal demoItemName={ demoItemName } modalProps={ props } value={ content } />);
            await saveDocContentByDemoName(demoItemName, newContent);
            await showSuccess();
        } catch (err) {}
    }, []);

    return {
        openModal,
    };
}
