import { IThemeVarUI } from '../palette/types/types';
import { TTokensDocGroupCfg } from './types';

const CRITERIA = {
    pathStartsWith: (str: string) => (tok: IThemeVarUI) => {
        return tok.id.indexOf(str) === 0;
    },
};

export const TOKENS_DOC_CONFIG: TTokensDocGroupCfg = {
    title: 'Tokens',
    description: 'Core tokens are 2nd level of tokens and recommended to use for every case. Also, core tokens uses in the component level. Core tokens have many categories for every role. Find these categories below.',
    subgroups: [
        {
            title: 'Semantic tokens',
            description: 'Some description about the colors category.',
            subgroups: [
                {
                    title: 'Primary',
                    description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                    items: CRITERIA.pathStartsWith('core/semantic/primary-'),
                },
                {
                    title: 'Secondary',
                    description: 'Uses for secondary actions, component states, that are should not attract user attention.',
                    items: CRITERIA.pathStartsWith('core/semantic/secondary-'),
                },
                {
                    title: 'Accent',
                    description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                    items: CRITERIA.pathStartsWith('core/semantic/accent-'),
                },
                {
                    title: 'Info',
                    description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                    items: CRITERIA.pathStartsWith('core/semantic/info-'),
                },
                {
                    title: 'Success',
                    description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                    items: CRITERIA.pathStartsWith('core/semantic/success-'),
                },
                {
                    title: 'Warning',
                    description: 'Uses for secondary actions, component states, that are should not attract user attention.',
                    items: CRITERIA.pathStartsWith('core/semantic/warning-'),
                },
                {
                    title: 'Error',
                    description: 'Uses in components for destructive or critical actions or information.',
                    items: CRITERIA.pathStartsWith('core/semantic/error-'),
                },
                {
                    title: 'Critical',
                    description: 'Uses in components for destructive or critical actions or information.',
                    items: CRITERIA.pathStartsWith('core/semantic/critical-'),
                },

            ],
        },
        {
            title: 'Neutral tokens',
            description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
            items: CRITERIA.pathStartsWith('core/neutral/'),
        },
        {
            title: 'Controls tokens',
            description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
            items: CRITERIA.pathStartsWith('core/controls/'),
        },
        {
            title: 'Icons tokens',
            description: 'Tokens for icons.',
            items: CRITERIA.pathStartsWith('core/icons/'),
        },
        {
            title: 'Surface tokens',
            description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
            items: CRITERIA.pathStartsWith('core/surfaces/'),
        },
        {
            title: 'Text tokens',
            description: 'Tokens for text and typography.',
            items: CRITERIA.pathStartsWith('core/text/'),
        },
        {
            title: 'Links tokens',
            description: 'Tokens for text and typography',
            items: CRITERIA.pathStartsWith('core/links/'),
        },
        {
            title: 'Other tokens',
            description: 'Other tokens.',
            items: CRITERIA.pathStartsWith('core/other/'),
        },
    ],
};
