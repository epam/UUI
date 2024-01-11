import {
    isGroupWithSubgroups,
    TOKENS_DOC_CONFIG,
    TTokensDocGroupCfg,
    TTokensDocItemCfg,
} from './config';
import { useThemeTokens } from '../palette/hooks/useThemeTokens/useThemeTokens';
import { IThemeVarUI, TThemeTokenValueType } from '../palette/types/types';
import { ITokensDocGroup, ITokensDocItem } from './types';

const PARAMS = {
    filter: {
        path: '',
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
    const result: ITokensDocGroup = {
        id: title.replace(/[\s]/g, '_'),
        title,
        description,
        children: [],
    };

    if (isGroupWithSubgroups(docGroupCfg)) {
        result.children = docGroupCfg.subgroups.map((s: TTokensDocGroupCfg) => convertDocGroup({ docGroupCfg: s, tokens }));
    } else {
        result.children = convertDocItems({ docItemCfg: docGroupCfg.items, tokens });
    }

    return result;
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
