import { IThemeVarUI } from '../palette/types/types';

export interface ITokensDocGroup {
    id: string,
    title: string,
    description: string,
    children: ITokensDocGroup[] | ITokensDocItem[],
}
export interface ITokensDocItem {
    cssVar: string, // use it to render color rectangle
    description: string,
    useCases: string,
    value: string, // hex, for tooltip
}

export type TTokensDocItemCfg = (token: IThemeVarUI) => boolean;
export type TTokensDocGroupCfg = TTokensDocGroupCfgWithSubgroups | TTokensDocGroupCfgWithItems;
export type TTokensDocGroupCfgWithSubgroups = { title: string, description: string, subgroups: TTokensDocGroupCfg[] };
export type TTokensDocGroupCfgWithItems = { title: string, description: string, items: TTokensDocItemCfg };

export const isGroupWithSubgroups = (cfg: TTokensDocGroupCfg): cfg is TTokensDocGroupCfgWithSubgroups => {
    return (cfg as TTokensDocGroupCfgWithSubgroups).subgroups !== undefined;
};
