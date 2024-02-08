import { TTokensDocGroupCfg } from './types';

export const TOKENS_DOC_CONFIG: TTokensDocGroupCfg[] = [
    {
        title: 'Semantic tokens',
        description: 'Some description about the colors category.',
        subgroups: [
            {
                title: 'Primary',
                description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                items: ('core/semantic/primary-'),
            },
            {
                title: 'Secondary',
                description: 'Uses for secondary actions, component states, that are should not attract user attention.',
                items: ('core/semantic/secondary-'),
            },
            {
                title: 'Accent',
                description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                items: ('core/semantic/accent-'),
            },
            {
                title: 'Info',
                description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                items: ('core/semantic/info-'),
            },
            {
                title: 'Success',
                description: 'It\'s primary brand theme color. Applied for primary actions and component states.',
                items: ('core/semantic/success-'),
            },
            {
                title: 'Warning',
                description: 'Uses for secondary actions, component states, that are should not attract user attention.',
                items: ('core/semantic/warning-'),
            },
            {
                title: 'Error',
                description: 'Uses in components for destructive or critical actions or information.',
                items: ('core/semantic/error-'),
            },
            {
                title: 'Critical',
                description: 'Uses in components for destructive or critical actions or information.',
                items: ('core/semantic/critical-'),
            },

        ],
    },
    {
        title: 'Neutral tokens',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/neutral/'),
    },
    {
        title: 'Controls tokens',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/controls/'),
    },
    {
        title: 'Icons tokens',
        description: 'Tokens for icons.',
        items: ('core/icons/'),
    },
    {
        title: 'Surface tokens',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/surfaces/'),
    },
    {
        title: 'Text tokens',
        description: 'Tokens for text and typography.',
        items: ('core/text/'),
    },
    {
        title: 'Links tokens',
        description: 'Tokens for links.',
        items: ('core/links/'),
    },
    {
        title: 'Other tokens',
        description: 'Other tokens.',
        items: ('core/other/'),
    },
];