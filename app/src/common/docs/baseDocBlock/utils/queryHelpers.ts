import { getCurrentTheme, getQuery } from '../../../../helpers';
import { DEFAULT_MODE, TMode, TTheme } from '../../docsConstants';
import { svc } from '../../../../services';

export class QueryHelpers {
    static isSkin(): boolean {
        return getQuery('isSkin') ?? JSON.parse(localStorage.getItem('app-theme-context'))?.isSkin ?? true;
    }

    static getMode(): TMode {
        return getQuery('mode') || DEFAULT_MODE;
    }

    static getTheme(): TTheme {
        return getCurrentTheme();
    }

    static toggleSkinMode = () => {
        const isSkin = QueryHelpers.isSkin();
        localStorage.setItem('app-theme-context', JSON.stringify({ isSkin: !isSkin }));
        QueryHelpers.handleNav({ isSkin: !isSkin });
    };

    static changeTab(mode: TMode) {
        QueryHelpers.handleNav({ mode });
    }

    static handleNav = (params: { id?: string; mode?: TMode, isSkin?: boolean, theme?: TTheme }) => {
        const mode: TMode = params.mode ? params.mode : QueryHelpers.getMode();
        const isSkin: boolean = params.isSkin ?? QueryHelpers.isSkin();
        const theme: TTheme = params.theme ? params.theme : QueryHelpers.getTheme();

        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: params.id || getQuery('id'),
                mode,
                isSkin: isSkin,
                theme,
            },
        });
    };
}
