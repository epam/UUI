import React, { useCallback, useMemo, useState } from 'react';
import { Button, Switch } from '@epam/uui';
import { AnalyticsEvent, useUuiContext } from '@epam/uui-core';

export default function AnalyticsContextEvents() {
    const svc = useUuiContext();
    const [switchValue, setSwitchValue] = useState<boolean>(false);

    const clickAnalyticsEvent: AnalyticsEvent = useMemo(
        () => ({
            name: 'click',
            category: 'docs',
            label: 'static_event',
        }),
        [],
    );

    const getValueChangeAnalyticsEvent = useCallback(
        (newValue: boolean, oldValue: boolean): AnalyticsEvent => ({
            name: 'switch',
            category: 'docs',
            label: 'dynamic_event',
            newValue,
            oldValue,
        }),
        [],
    );

    const sendEventDirectly = useCallback(() => {
        svc.uuiAnalytics.sendEvent({
            name: 'click',
            category: 'docs',
            label: 'directly_sent',
        });
    }, []);

    return (
        <div>
            <Button clickAnalyticsEvent={ clickAnalyticsEvent } />

            <Switch value={ switchValue } onValueChange={ setSwitchValue } getValueChangeAnalyticsEvent={ getValueChangeAnalyticsEvent } />

            <Button onClick={ sendEventDirectly } />
        </div>
    );
}
