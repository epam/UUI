import { IDocBuilderGenCtx, TPropEditorTypeOverride, TSkin, TTypeRef } from '@epam/uui-docs';
import { useUuiContext } from '@epam/uui-core';
import { useMemo } from 'react';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import { getAllIcons } from '../../../documents/iconListHelpers';
import { AppContext, BuiltInTheme, TTheme } from '../../../data';
import { CustomThemeManifest } from '../../../data/customThemes';
import { useAppThemeContext } from '../../../helpers/appTheme';

export function getSkin(theme: TTheme, isSkin: boolean): TSkin {
    if (!isSkin) return TSkin.UUI;

    switch (theme) {
        case BuiltInTheme.electric:
            return TSkin.Electric;
        case BuiltInTheme.loveship:
        case BuiltInTheme.loveship_dark:
            return TSkin.Loveship;
        case BuiltInTheme.promo:
            return TSkin.Promo;
        default:
            return TSkin.UUI;
    }
}

export function useDocBuilderGenCtx(propsOverride: TPropEditorTypeOverride[TTypeRef] | undefined): IDocBuilderGenCtx {
    const uuiCtx = useUuiContext<any, AppContext>();
    return useMemo(() => {
        const result: IDocBuilderGenCtx = {
            loadDocsGenType,
            uuiCtx: {
                uuiNotifications: uuiCtx.uuiNotifications,
            },
            demoApi: uuiCtx.api.demo,
            getIconList: getAllIcons,
            propsOverride,
        };
        return result;
    }, [propsOverride, uuiCtx.api.demo, uuiCtx.uuiNotifications]);
}

export function usePropEditorTypeOverride(themeId: TTheme, typeRef: TTypeRef | undefined): TPropEditorTypeOverride[TTypeRef] | undefined {
    const { themesById } = useAppThemeContext();
    if (typeRef && themesById) {
        const themeDetails = (themesById[themeId] as CustomThemeManifest);
        return themeDetails?.propsOverride?.[typeRef];
    }
}
