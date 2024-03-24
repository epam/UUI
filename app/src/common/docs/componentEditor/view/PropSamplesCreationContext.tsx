import { Icon } from '@epam/uui-core';
import { IPropSamplesCreationContext, PropDocPropsUnknown } from '@epam/uui-docs';
import { svc } from '../../../../services';
import { getAllIcons } from '../../../../documents/iconListHelpers';

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
        return getAllIcons<Icon>();
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
