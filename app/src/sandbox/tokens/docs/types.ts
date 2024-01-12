import { IThemeVarUI } from '../palette/types/types';

export type ITokensDocGroupWithSubgroups = {
    id: string,
    title: string,
    description: string,
    subgroups: ITokensDocGroup[]
};
export type ITokensDocGroupWithItems = {
    id: string,
    title: string,
    description: string,
    items: ITokensDocItem[]
};
export type ITokensDocGroup = ITokensDocGroupWithSubgroups | ITokensDocGroupWithItems;
export const isGroupWithSubgroups = (cfg: ITokensDocGroup): cfg is ITokensDocGroupWithSubgroups => {
    return (cfg as ITokensDocGroupWithSubgroups).subgroups !== undefined;
};
export const isGroupWithItems = (cfg: ITokensDocGroup[] | ITokensDocItem[]): cfg is ITokensDocItem[] => {
    return (cfg as ITokensDocItem[])[0].cssVar !== undefined;
};
export const isGroupWithItemsArray = (cfg: ITokensDocGroup[] | ITokensDocItem[]): cfg is ITokensDocGroupWithItems[] => {
    return (cfg as ITokensDocGroupWithItems[])[0].items !== undefined;
};

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

export const isGroupCfgWithSubgroups = (cfg: TTokensDocGroupCfg): cfg is TTokensDocGroupCfgWithSubgroups => {
    return (cfg as TTokensDocGroupCfgWithSubgroups).subgroups !== undefined;
};
