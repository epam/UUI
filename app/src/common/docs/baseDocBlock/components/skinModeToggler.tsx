import * as React from 'react';
import { IconContainer } from '@epam/uui-components';
import { Checkbox, Tooltip } from '@epam/uui';
import { TMode } from '../../docsConstants';
//
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';
//
import css from './skinModeToggler.module.scss';

const CONTROL_DESCRIPTION = 'If checked, a component from the skin-specific package will be used, according to the selected theme (for example, "@epam/loveship"). If unchecked, it will use a component from the "@epam/uui" package, only with semantic props.';

type TSkinModeTogglerProps = {
    mode: TMode;
    theme: string;
    isSkinEnabled: boolean;
    onToggleSkin: () => void;
};

export function SkinModeToggler(props: TSkinModeTogglerProps) {
    const { mode, theme, onToggleSkin, isSkinEnabled } = props;
    const isSupported = [TMode.propsEditor].includes(mode)
        && isSkinSupportedInTheme(theme);

    if (isSupported) {
        return (
            <>
                <Checkbox
                    label="Show theme specific props"
                    value={ isSkinEnabled }
                    onValueChange={ onToggleSkin }
                />
                <Tooltip content={ CONTROL_DESCRIPTION } color="inverted">
                    <IconContainer icon={ InfoIcon } cx={ css.infoIcon } />
                </Tooltip>
            </>
        );
    }
}

function isSkinSupportedInTheme(theme: string): boolean {
    return ['electric', 'loveship', 'loveship_dark', 'promo'].includes(theme);
}
