import * as React from 'react';
import { FlexRow, Panel } from '@epam/uui';
import { IPropSamplesCreationContext } from '@epam/uui-docs';
import { svc } from '../../../../services';

export class PropSamplesCreationContext implements IPropSamplesCreationContext<any> {
    constructor(
        private reactClassComponent: {
            forceUpdate: () => void;
            getInputValues: () => { [p: string]: any },
            handleChangeValueOfPropertyValue: (newValue: string) => void
        },
    ) {
    }

    getCallback = (name: string) => {
        function callbackFn(...args: any[]) {
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
        const fn = (newValue: string) => {
            this.reactClassComponent.handleChangeValueOfPropertyValue(newValue);
        };
        fn.displayName = '(newValue) => { ... }';
        return fn;
    };

    getSelectedProps = () => this.reactClassComponent.getInputValues();

    forceUpdate = () => {
        this.reactClassComponent.forceUpdate();
    };

    demoApi = svc.api.demo;
}
