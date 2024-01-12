import { STATUS_FILTER, TLoadThemeTokensParams, TThemeTokenValueType, TTokensLocalFilter } from './types/types';

export const DEFAULT_LOAD_PARAMS: TLoadThemeTokensParams = {
    valueType: TThemeTokenValueType.chain,
    filter: {
        path: 'core',
        published: undefined,
    },
};

export const DEFAULT_LOCAL_FILTER: TTokensLocalFilter = {
    status: STATUS_FILTER.all,
};
