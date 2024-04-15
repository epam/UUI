import { getQuery } from './getQuery';
import { BuiltInTheme } from '../data';
import { svc } from '../services';

export const QUERY_PARAM_THEME = 'theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme = () => {
    let themeId: string = getQuery(QUERY_PARAM_THEME) ?? (localStorage.getItem('app-theme'));
    if (!svc.uuiApp.themesById[themeId]) {
        themeId = DEFAULT_THEME;
    }
    return themeId;
};
