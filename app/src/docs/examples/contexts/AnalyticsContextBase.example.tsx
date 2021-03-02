import * as React from "react";
import {useCallback} from "react";
import {ContextProvider} from "@epam/uui";

export const AnalyticsContextBase: React.FC = () => {
    const loadAppContext = useCallback((api: any) => Promise.resolve(), []);
    const onInitCompleted = useCallback(() => Promise.resolve(), []);

    return (
        <ContextProvider loadAppContext={ loadAppContext }
                         onInitCompleted={ onInitCompleted }
                         gaCode='Your google analytics secret key'
                         ampCode='Your amplitude secret key'
        >
            Your app component
        </ContextProvider>
    );
};