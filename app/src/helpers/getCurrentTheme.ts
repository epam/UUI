import { getQuery } from './getQuery';
import { TTheme } from '../common/docs/docsConstants';

const DEFAULT_THEME = TTheme.loveship;
export const getCurrentTheme: () => TTheme = () => {
    return getQuery('theme') ?? (localStorage.getItem('app-theme') as TTheme) ?? DEFAULT_THEME;
};
