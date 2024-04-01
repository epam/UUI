import { IDocBuilderGenCtx, TSkin } from '@epam/uui-docs';
import { TTheme } from '../docsConstants';
import { useUuiContext } from '@epam/uui-core';
import { useMemo } from 'react';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import { getAllIcons } from '../../../documents/iconListHelpers';

export function getSkin(theme: TTheme, isSkin: boolean): TSkin {
    if (!isSkin) return TSkin.UUI;

    switch (theme) {
        case TTheme.electric:
            return TSkin.Electric;
        case TTheme.loveship:
        case TTheme.loveship_dark:
            return TSkin.Loveship;
        case TTheme.promo:
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
            uuiCtx: { uuiNotifications: uuiCtx.uuiNotifications },
            getIconList: getAllIcons,
        };
        return result;
    }, [uuiCtx.uuiNotifications]);
}
