import { getCurrentTheme, getQuery } from '../../../../helpers';
import { DEFAULT_MODE, TMode } from '../../docsConstants';
import { svc } from '../../../../services';

export class QueryHelpers {
    static isSkin(): boolean {
        return getQuery('isSkin') ?? JSON.parse(localStorage.getItem('app-theme-context'))?.isSkin ?? true;
    }

    static getMode(): TMode {
        return getQuery('mode') || DEFAULT_MODE;
    }

    static getTheme(): string {
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

    static handleNav = (params: { id?: string; mode?: TMode, isSkin?: boolean, theme?: string }) => {
        const mode: TMode = params.mode ? params.mode : QueryHelpers.getMode();
        const isSkin: boolean = params.isSkin ?? QueryHelpers.isSkin();
        const theme: string = params.theme ? params.theme : QueryHelpers.getTheme();

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
