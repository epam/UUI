import {
    TOKENS_DOC_CONFIG,
} from './config';
import { useThemeTokens } from '../palette/hooks/useThemeTokens/useThemeTokens';
import { IThemeVarUI, TLoadThemeTokensParams, TThemeTokenValueType } from '../palette/types/types';
import { isGroupCfgWithSubgroups, ITokensDocGroup, ITokensDocItem, TTokensDocGroupCfg, TTokensDocItemCfg } from './types';

const PARAMS: TLoadThemeTokensParams = {
    filter: {
        path: '',
        published: 'yes',
    },
    valueType: TThemeTokenValueType.chain,
};
export function useTokensDoc() {
    const result = useThemeTokens(PARAMS);
    const {
        tokens,
        loading,
    } = result;
    return {
        loading,
        tokens: convertDocGroup({ tokens, docGroupCfg: TOKENS_DOC_CONFIG }),
    };
}

function convertDocGroup(params: { docGroupCfg: TTokensDocGroupCfg, tokens: IThemeVarUI[] }): ITokensDocGroup {
    const { docGroupCfg, tokens } = params;
    const { title, description } = docGroupCfg;
    const id = title.replace(/[\s]/g, '_');

    if (isGroupCfgWithSubgroups(docGroupCfg)) {
        return {
            id,
            title,
            description,
            subgroups: docGroupCfg.subgroups.map((s: TTokensDocGroupCfg) => convertDocGroup({ docGroupCfg: s, tokens })),
        };
    }
    return {
        id,
        title,
        description,
        items: convertDocItems({ docItemCfg: docGroupCfg.items, tokens }),
    };
}

function convertDocItems(params: { docItemCfg: TTokensDocItemCfg, tokens: IThemeVarUI[] }): ITokensDocItem[] {
    return params.tokens.reduce<ITokensDocItem[]>((acc, tok) => {
        if (params.docItemCfg(tok)) {
            acc.push({
                cssVar: tok.cssVar,
                description: tok.description,
                useCases: tok.useCases,
                value: tok.value.browser,
            });
        }
        return acc;
    }, []);
}
