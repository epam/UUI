import { TTheme } from '../common/docs';
import { getQuery } from './getQuery';

const DEFAULT_THEME = TTheme.loveship;
export const getCurrentTheme: () => TTheme = () => {
    return getQuery('theme') ?? (localStorage.getItem('app-theme') as TTheme) ?? DEFAULT_THEME;
};
