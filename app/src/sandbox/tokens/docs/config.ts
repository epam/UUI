import { IThemeVarUI } from '../palette/types/types';

export type TTokensDocItemCfg = (token: IThemeVarUI) => boolean;
export type TTokensDocGroupCfg = TTokensDocGroupCfgWithSubgroups | TTokensDocGroupCfgWithItems;
export type TTokensDocGroupCfgWithSubgroups = { title: string, description: string, subgroups: TTokensDocGroupCfg[] };
export type TTokensDocGroupCfgWithItems = { title: string, description: string, items: TTokensDocItemCfg };

export const isGroupWithSubgroups = (cfg: TTokensDocGroupCfg): cfg is TTokensDocGroupCfgWithSubgroups => {
    return (cfg as TTokensDocGroupCfgWithSubgroups).subgroups !== undefined;
};

const CRITERIA = {
    pathStartsWith: (str: string) => (tok: IThemeVarUI) => {
        return tok.id.indexOf(str) === 0;
    },
};

export const TOKENS_DOC_CONFIG: TTokensDocGroupCfg = {
    title: 'Core or base tokens',
    description: 'Core tokens is 2nd level of tokens...',
    subgroups: [
        {
            title: 'Semantic tokens',
            description: 'Some description about...',
            subgroups: [
                {
                    title: 'Primary',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/primary-'),
                },
                {
                    title: 'Secondary',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/secondary-'),
                },
                {
                    title: 'Accent',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/accent-'),
                },
                {
                    title: 'Info',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/info-'),
                },
                {
                    title: 'Success',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/success-'),
                },
                {
                    title: 'Warning',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/warning-'),
                },
                {
                    title: 'Error',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/error-'),
                },
                {
                    title: 'Critical',
                    description: 'Applied for...',
                    items: CRITERIA.pathStartsWith('core/semantic/critical-'),
                },

            ],
        },
        {
            title: 'Neutral tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/neutral/'),
        },
        {
            title: 'Controls tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/controls/'),
        },
        {
            title: 'Icons tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/icons/'),
        },
        {
            title: 'Surface tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/surfaces/'),
        },
        {
            title: 'Text tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/text/'),
        },
        {
            title: 'Links tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/links/'),
        },
        {
            title: 'Other tokens',
            description: 'Some description about...',
            items: CRITERIA.pathStartsWith('core/other/'),
        },
    ],
};
