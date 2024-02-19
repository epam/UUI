import { TTokensDocGroupCfg } from './types';

export const TOKENS_DOC_CONFIG: TTokensDocGroupCfg[] = [
    {
        title: 'Semantic',
        description: 'The theme default palette tokens. These tokens reuses in all components and also can be used for custom content, following their roles.',
        subgroupsHeader: [
            'light highlights and backgrounds mostly',
            'light component backgrounds',
            'light component backgrounds hover',
            'solid component backgrounds, active states and borders',
            'solid component backgrounds hover',
            'contrast text',
        ],
        subgroups: [
            {
                title: 'Primary',
                description: 'Uses for primary actions and component states. It\'s primary theme color.',
                items: ('core/semantic/primary-'),
            },
            {
                title: 'Secondary',
                description: 'Uses for secondary actions, component states, that are should not attract user attention.',
                items: ('core/semantic/secondary-'),
            },
            {
                title: 'Accent',
                description: 'Use for accents, call to actions in addition to primary color. Can be used instead of primary in some cases.',
                items: ('core/semantic/accent-'),
            },
            {
                title: 'Info',
                description: 'Uses in components to deliver information in calm, normal way.',
                items: ('core/semantic/info-'),
            },
            {
                title: 'Success',
                description: 'Uses in components to deliver success message, give positive feedback.',
                items: ('core/semantic/success-'),
            },
            {
                title: 'Warning',
                description: 'Uses in components to deliver middle critical message, draw user attention from the system.',
                items: ('core/semantic/warning-'),
            },
            {
                title: 'Error',
                description: 'Uses in components to deliver highly critical message, barrier or error, draw user attention from the system.',
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
        title: 'Neutral',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/neutral/'),
    },
    {
        title: 'Controls',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/controls/'),
    },
    {
        title: 'Icons',
        description: 'Tokens for icons.',
        items: ('core/icons/'),
    },
    {
        title: 'Surface',
        description: 'Tokens for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/surfaces/'),
    },
    {
        title: 'Text',
        description: 'Tokens for text and typography.',
        items: ('core/text/'),
    },
    {
        title: 'Links',
        description: 'Tokens for links.',
        items: ('core/links/'),
    },
    {
        title: 'Other',
        description: 'Other tokens.',
        items: ('core/other/'),
    },
];
