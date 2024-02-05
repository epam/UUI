import {
    isTokenRowGroup,
    IThemeVarUI,
    ITokenRow,
    ITokenRowGroup,
    STATUS_FILTER, TThemeVarUiErr,
    TTokensLocalFilter,
} from '../../types/types';

export function convertLocalTokens(
    params: { grouped: boolean, tokens: IThemeVarUI[], localFilter: TTokensLocalFilter | undefined },
): ITokenRow[] {
    const { localFilter, tokens, grouped } = params;
    const filterFn = getFilter(localFilter);
    const tokensFiltered = tokens.filter(filterFn);
    if (grouped) {
        const parents = new Map<string, ITokenRowGroup>();
        const tokensWithParentId = tokensFiltered.map((srcToken) => {
            const group = getTokenParent(srcToken.id);
            if (group) {
                parents.set(group.id, group);
                return { ...srcToken, parentId: group.id };
            }
            return srcToken;
        });
        const parentsArr = Array.from(parents.values());
        return [...tokensWithParentId, ...parentsArr];
    }
    return tokensFiltered;
}

function getTokenParent(path: string): ITokenRowGroup {
    const pathSplit = path.split('/');
    const pathSplitArr = pathSplit.slice(0, pathSplit.length - 1);
    return { id: pathSplitArr.join('/'), _group: true };
}

function getFilter(filter: TTokensLocalFilter | undefined) {
    return (item: ITokenRow) => {
        if (filter) {
            if (isTokenRowGroup(item)) {
                return true;
            }
            switch (filter.status) {
                case STATUS_FILTER.absent: {
                    return !!item.value.errors.find(({ type }) => type === TThemeVarUiErr.VAR_ABSENT);
                }
                case STATUS_FILTER.mismatched: {
                    return !!item.value.errors.find(({ type }) => type === TThemeVarUiErr.VALUE_MISMATCHED);
                }
                case STATUS_FILTER.ok: {
                    return !item.value.errors.length;
                }
                default: {
                    return true;
                }
            }
        }
        return true;
    };
}
