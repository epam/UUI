import * as React from "react";
import {useCallback, useMemo, useState} from "react";
import {Button, Switch} from "@epam/promo";
import {AnalyticsEvent} from "@epam/uui";
import {svc} from "../../../services";

export const AnalyticsContextEvents: React.FC = () => {
    const [switchValue, setSwitchValue] = useState(false);

    const clickAnalyticsEvent: AnalyticsEvent = useMemo(() => ({
        name: "click",
        category: "docs",
        label: "static_event",
    }), []);


    const getValueChangeAnalyticsEvent = useCallback((newValue: boolean, oldValue: boolean): AnalyticsEvent => ({
        name: "switch",
        category: "docs",
        label: "dynamic_event",
        newValue,
        oldValue,
    }), []);

    const sendEventDirectly = useCallback(() => {
        svc.uuiAnalytics.sendEvent({
            name: "click",
            category: "docs",
            label: "directly_sent",
        });
    }, []);

    return (
        <div>
            <Button clickAnalyticsEvent={ clickAnalyticsEvent }/>

            <Switch value={ switchValue }
                    onValueChange={ setSwitchValue }
                    getValueChangeAnalyticsEvent={ getValueChangeAnalyticsEvent }/>

            <Button onClick={ sendEventDirectly }/>
        </div>
    );
};