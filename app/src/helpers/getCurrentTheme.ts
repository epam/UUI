import { getQuery } from './getQuery';
import { BuiltInTheme } from '../data';

export const QUERY_PARAM_THEME = 'theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme: () => string = () => {
    return getQuery(QUERY_PARAM_THEME) ?? (localStorage.getItem('app-theme')) ?? DEFAULT_THEME;
};
