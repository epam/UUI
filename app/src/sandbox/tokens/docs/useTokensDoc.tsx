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
export function useTokensDoc(): { loading: boolean, tokens: ITokensDocGroup[] } {
    const result = useThemeTokens(PARAMS);
    const {
        tokens,
        loading,
    } = result;
    return {
        loading,
        tokens: convertDocGroup({ tokens, docGroupCfgArr: TOKENS_DOC_CONFIG }),
    };
}

function convertDocGroup(params: { docGroupCfgArr: TTokensDocGroupCfg[], tokens: IThemeVarUI[] }): ITokensDocGroup[] {
    const { docGroupCfgArr, tokens } = params;

    return docGroupCfgArr.map((group) => {
        const { title, description } = group;
        const id = title.replace(/[\s]/g, '_');

        if (isGroupCfgWithSubgroups(group)) {
            return {
                _type: 'group_with_subgroups',
                id,
                title,
                description,
                subgroups: convertDocGroup({ docGroupCfgArr: group.subgroups, tokens }),
            };
        }
        return {
            _type: 'group_with_items',
            id,
            title,
            description,
            items: convertDocItems({ docItemCfg: group.items, tokens }),
        };
    });
}

function convertDocItems(params: { docItemCfg: TTokensDocItemCfg, tokens: IThemeVarUI[] }): ITokensDocItem[] {
    const CRITERIA = {
        pathStartsWith: (str: string) => (tok: IThemeVarUI) => {
            return tok.id.indexOf(str) === 0;
        },
    };
    const condition = CRITERIA.pathStartsWith(params.docItemCfg);

    return params.tokens.reduce<ITokensDocItem[]>((acc, tok) => {
        if (condition(tok)) {
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
