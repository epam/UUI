import {
    TOKENS_DOC_CONFIG,
} from './TokensPageConfig';
import { useThemeTokens } from '../../../sandbox/tokens/palette/hooks/useThemeTokens/useThemeTokens';
import { IThemeVarUI, TLoadThemeTokensParams, TThemeTokenValueType } from '../../../sandbox/tokens/palette/types/types';
import { isGroupCfgWithSubgroups, ITokensDocGroup, ITokensDocItem, TTokensDocGroupCfg, TTokensDocItemCfg } from './types';
import { TTheme } from '../../../data';

const PARAMS: TLoadThemeTokensParams = {
    filter: {
        path: '',
        published: 'yes',
    },
    valueType: TThemeTokenValueType.chain,
};
export function useTokensDoc(): { loading: boolean, tokens: ITokensDocGroup[], uuiTheme: TTheme } {
    const result = useThemeTokens(PARAMS);
    const {
        tokens,
        loading,
        uuiTheme,
    } = result;
    return {
        loading,
        tokens: convertDocGroup({ tokens, docGroupCfgArr: TOKENS_DOC_CONFIG }),
        uuiTheme,
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
                subgroupsHeader: group.subgroupsHeader,
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

const excludedTokens = ['primary-contrast', 'secondary-contrast', 'accent-contrast', 'critical-contrast', 'info-contrast', 'success-contrast', 'warning-contrast', 'error-contrast'];

function convertDocItems(params: { docItemCfg: TTokensDocItemCfg, tokens: IThemeVarUI[] }): ITokensDocItem[] {
    const CRITERIA = {
        pathStartsWith: (str: string) => (tok: IThemeVarUI) => {
            return tok.id.indexOf(str) === 0 && !excludedTokens.find((i) => tok.id.includes(i));
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
                baseToken: tok.value.figma?.alias[tok.value.figma.alias.length - 1]?.id,
            });
        }
        return acc;
    }, []);
}
