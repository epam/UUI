import { getThemeRootComputedStyles } from '../../../../../helpers/appRootUtils';

export function getBrowserTokens(): { getPropertyValue: (property: string) => string; } {
    return getThemeRootComputedStyles();
}
