import { IThemeVarUI } from '../palette/types/types';

export type TTokensDocItemCfg = (token: IThemeVarUI) => boolean;
export type TTokensDocGroupCfg = TTokensDocGroupCfgWithSubgroups | TTokensDocGroupCfgWithItems;
export type TTokensDocGroupCfgWithSubgroups = { title: string, description: string, subgroups: TTokensDocGroupCfg[] };
export type TTokensDocGroupCfgWithItems = { title: string, description: string, items: TTokensDocItemCfg };

export const isGroupWithSubgroups = (cfg: TTokensDocGroupCfg): cfg is TTokensDocGroupCfgWithSubgroups => {
    return (cfg as TTokensDocGroupCfgWithSubgroups).subgroups !== undefined;
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
                    items: (tok) => tok.id.indexOf('core/semantic/primary-') === 0,
                },
                {
                    title: 'Secondary',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/secondary-') === 0,
                },
                {
                    title: 'Accent',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/accent-') === 0,
                },
                {
                    title: 'Info',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/info-') === 0,
                },
                {
                    title: 'Success',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/success-') === 0,
                },
                {
                    title: 'Warning',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/warning-') === 0,
                },
                {
                    title: 'Error',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/error-') === 0,
                },
                {
                    title: 'Critical',
                    description: 'Applied for...',
                    items: (tok) => tok.id.indexOf('core/semantic/critical-') === 0,
                },

            ],
        },
        {
            title: 'Neutral tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/neutral/') === 0,
        },
        {
            title: 'Controls tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/controls/') === 0,
        },
        {
            title: 'Icons tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/icons/') === 0,
        },
        {
            title: 'Surface tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/surfaces/') === 0,
        },
        {
            title: 'Text tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/text/') === 0,
        },
        {
            title: 'Links tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/links/') === 0,
        },
        {
            title: 'Other tokens',
            description: 'Some description about...',
            items: (tok) => tok.id.indexOf('core/other/') === 0,
        },
    ],
};
