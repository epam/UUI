type ITokensDocGroupBase = {
    id: string,
    title: string,
    description: string,
};

export type ITokensDocGroup =
    ({ _type: 'group_with_subgroups', subgroups: ITokensDocGroup[], subgroupsHeader: string[], } & ITokensDocGroupBase)
    |
    ({ _type: 'group_with_items', items: ITokensDocItem[] } & ITokensDocGroupBase);

export interface ITokensDocItem {
    cssVar: string, // use it to render color rectangle
    description: string,
    useCases: string,
    value: string, // hex, for tooltip
    baseToken: string | undefined,
}

export type TTokensDocItemCfg = string;
export type TTokensDocGroupCfg = TTokensDocGroupCfgWithSubgroups | TTokensDocGroupCfgWithItems;
export type TTokensDocGroupCfgWithSubgroups = { title: string, description: string, subgroupsHeader: string[], subgroups: TTokensDocGroupCfg[] };
export type TTokensDocGroupCfgWithItems = { title: string, description: string, items: TTokensDocItemCfg };

export const isGroupCfgWithSubgroups = (cfg: TTokensDocGroupCfg): cfg is TTokensDocGroupCfgWithSubgroups => {
    return (cfg as TTokensDocGroupCfgWithSubgroups).subgroups !== undefined;
};
