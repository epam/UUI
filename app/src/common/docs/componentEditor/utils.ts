import { IDocBuilderGenCtx, TSkin } from '@epam/uui-docs';
import { useUuiContext } from '@epam/uui-core';
import { useMemo } from 'react';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import { getAllIcons } from '../../../documents/iconListHelpers';
import { BuiltInTheme } from '../../../data';

export function getSkin(theme: string, isSkin: boolean): TSkin {
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

export function useDocBuilderGenCtx(): IDocBuilderGenCtx {
    const uuiCtx = useUuiContext();
    return useMemo(() => {
        const result: IDocBuilderGenCtx = {
            loadDocsGenType,
            uuiCtx: {
                uuiNotifications: uuiCtx.uuiNotifications,
            },
            demoApi: uuiCtx.api.demo,
            getIconList: getAllIcons,
        };
        return result;
    }, [uuiCtx.api.demo, uuiCtx.uuiNotifications]);
}
