import { getQuery } from './getQuery';
import { TTheme } from '../common/docs/docsConstants';

export const QUERY_PARAM_THEME = 'theme';
const DEFAULT_THEME = TTheme.loveship;

export const getCurrentTheme: () => TTheme = () => {
    return getQuery(QUERY_PARAM_THEME) ?? (localStorage.getItem('app-theme') as TTheme) ?? DEFAULT_THEME;
};
