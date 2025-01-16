import { TTokensDocGroupCfg } from './types';

export const TOKENS_DOC_CONFIG: TTokensDocGroupCfg[] = [
    {
        title: 'Semantic',
        description: 'Defines semantic palette. These variables are used widely in many UUI components, to apply colors according their role. These variables can also be utilized directly in application code, in accordance with their designated roles.',
        subgroupsHeader: [
            'light highlights and backgrounds',
            'light component backgrounds',
            'light component backgrounds hover',
            'solid component backgrounds, active states and borders',
            'solid component backgrounds hover',
            'contrast text',
        ],
        subgroups: [
            {
                title: 'Primary',
                description: 'For primary actions and component states. It\'s a primary theme color.',
                items: ('core/semantic/primary-'),
            },
            {
                title: 'Secondary',
                description: 'For secondary actions, component states, that should not attract user attention.',
                items: ('core/semantic/secondary-'),
            },
            {
                title: 'Accent',
                description: 'For accents, call to actions, in addition to primary color. Can be used in place of primary.',
                items: ('core/semantic/accent-'),
            },
            {
                title: 'Info',
                description: 'Used to deliver information in a calm, normal way.',
                items: ('core/semantic/info-'),
            },
            {
                title: 'Success',
                description: 'Used to deliver success message, or give positive feedback.',
                items: ('core/semantic/success-'),
            },
            {
                title: 'Warning',
                description: 'Used to deliver non-critical message, draw user attention.',
                items: ('core/semantic/warning-'),
            },
            {
                title: 'Error',
                description: 'Used to deliver critical message, barrier or error, draw user attention.',
                items: ('core/semantic/error-'),
            },
            {
                title: 'Critical',
                description: 'Used for destructive, critical actions or deliver critically important information.',
                items: ('core/semantic/critical-'),
            },

        ],
    },
    {
        title: 'Neutral',
        description: 'Grey scale palette. Used for different levels of surfaces, text colors, borders, neutral-colored component\'s parts',
        items: ('core/neutral/'),
    },
    {
        title: 'Surfaces',
        description: 'Variables for different types of surfaces: from the background of the application and section colors to dividers and overlays.',
        items: ('core/surfaces/'),
    },
    {
        title: 'Text',
        description: 'Variables for text and typography.',
        items: ('core/text/'),
    },
    {
        title: 'Links',
        description: 'Variables for links.',
        items: ('core/links/'),
    },
    {
        title: 'Icons',
        description: 'Variables for icons.',
        items: ('core/icons/'),
    },
    {
        title: 'Other',
        description: 'Other variables.',
        items: ('core/other/'),
    },
    {
        title: 'Controls',
        description: 'Defines common part of controls like Input borders.',
        items: ('core/controls/'),
    },
];
