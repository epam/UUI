import { TSkin } from '@epam/uui-docs';
import { TTheme } from '../docsConstants';

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
