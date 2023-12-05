import * as React from 'react';
import { FlexRow, Panel } from '@epam/uui';
import { Icon } from '@epam/uui-core';
import { IPropSamplesCreationContext, PropDocPropsUnknown } from '@epam/uui-docs';
import { svc } from '../../../../services';
import { getIconList } from '../../../../documents/iconListHelpers';

export class PropSamplesCreationContext implements IPropSamplesCreationContext {
    constructor(
        private ctxInterface: {
            forceUpdate: () => void;
            getInputValues: () => PropDocPropsUnknown,
            handleChangeValueOfPropertyValue: (newValue: unknown) => void
        },
    ) {
    }

    getIconList = () => {
        return getIconList<Icon>(true);
    };

    getCallback = (name: string) => {
        function callbackFn(...args: unknown[]) {
            svc.uuiNotifications
                .show(
                    () => (
                        <Panel shadow={ true } background="surface-main">
                            <FlexRow padding="24" vPadding="12" borderBottom={ true }>
                                <pre>
                                    {name}
                                    (
                                    {args.length}
                                    {' '}
                                    args)
                                </pre>
                            </FlexRow>
                        </Panel>
                    ),
                    { position: 'bot-right' },
                )
                .catch(() => null);
            // eslint-disable-next-line no-console
            console.log(`${name} (`, args, ')');
        }
        Object.defineProperty(callbackFn, 'name', { value: 'callback' });
        return callbackFn;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getChangeHandler = (_propName: string) => {
        const fn = (newValue: unknown) => {
            this.ctxInterface.handleChangeValueOfPropertyValue(newValue);
        };
        fn.displayName = '(newValue) => { ... }';
        return fn as (newValue: unknown) => void;
    };

    getSelectedProps = () => this.ctxInterface.getInputValues();

    forceUpdate = () => {
        this.ctxInterface.forceUpdate();
    };

    demoApi = svc.api.demo;
}
