import { TokensObject } from './types';

export const defaultTokens: TokensObject = {
    palette: {
        white: {
            value: '#FFFFFF',
            type: 'color',
        },
        gray: {
            gray5: {
                value: '#FAFAFC',
                type: 'color',
            },
            gray10: {
                value: '#F5F6FA',
                type: 'color',
            },
            gray20: {
                value: '#EBEDF5',
                type: 'color',
            },
            gray30: {
                value: '#E1E3EB',
                type: 'color',
            },
            gray40: {
                value: '#CED0DB',
                type: 'color',
            },
            gray50: {
                value: '#ACAFBF',
                type: 'color',
            },
            gray60: {
                value: '#6C6F80',
                type: 'color',
            },
            gray70: {
                value: '#474A59',
                type: 'color',
            },
            gray80: {
                value: '#303240',
                type: 'color',
            },
            gray90: {
                value: '#1D1E26',
                type: 'color',
            },
        },
        blue: {
            'blue-lightest': {
                value: '#CEEFFF',
                type: 'color',
            },
            'blue-light': {
                value: '#B5E6FF',
                type: 'color',
            },
            blue: {
                value: '#008ACE',
                type: 'color',
            },
            'blue-dark': {
                value: '#0079B5',
                type: 'color',
            },
            'blue-darkest': {
                value: '#00689B',
                type: 'color',
            },
        },
        green: {
            'green-lightest': {
                value: '#EEFFCC',
                type: 'color',
            },
            'green-light': {
                value: '#E5FFB3',
                type: 'color',
            },
            green: {
                value: '#88CC00',
                type: 'color',
            },
            'green-dark': {
                value: '#77B300',
                type: 'color',
            },
            'green-darkest': {
                value: '#669900',
                type: 'color',
            },
        },
        amber: {
            'amber-lightest': {
                value: '#FFF2CC',
                type: 'color',
            },
            'amber-light': {
                value: '#FFECB3',
                type: 'color',
            },
            amber: {
                value: '#FFC000',
                type: 'color',
            },
            'amber-dark': {
                value: '#E6AD00',
                type: 'color',
            },
            'amber-darkest': {
                value: '#CC9A00',
                type: 'color',
            },
        },
        red: {
            'red-lightest': {
                value: '#FADED9',
                type: 'color',
            },
            'red-light': {
                value: '#F8CBC2',
                type: 'color',
            },
            red: {
                value: '#E54322',
                type: 'color',
            },
            'red-dark': {
                value: '#D53919',
                type: 'color',
            },
            'red-darkest': {
                value: '#BE3316',
                type: 'color',
            },
        },
    },
    core: {
        'font-regular': {
            value: "'Sans Regular', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-semibold': {
            value: "'Sans Semibold', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-italic': {
            value: "'Sans Italic', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-primary': {
            value: "'Museo Sans', 'Sans Semibold', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-promo': {
            value: "'Museo Slab', 'Roboto Slab', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-mono': {
            value: "'Roboto Mono', Arial, sans-serif",
            type: 'fontFamilies',
        },
        'font-redacted': {
            value: "'Redacted'",
            type: 'fontFamilies',
        },
        'accent-color': {
            value: '$palette.green.green',
            type: 'color',
        },
        'accent-light-color': {
            value: '{palette.green.green-light}',
            type: 'color',
        },
        'accent-lightest-color': {
            value: '{palette.green.green-lightest}',
            type: 'color',
        },
        'accent-dark-color': {
            value: '$palette.green.green-dark',
            type: 'color',
        },
        'accent-darkest-color': {
            value: '$palette.green.green-darkest',
            type: 'color',
        },
        'primary-color': {
            value: '$palette.blue.blue',
            description: 'Primary color for theme',
            type: 'color',
        },
        'primary-light-color': {
            value: '$palette.blue.blue-light',
            type: 'color',
        },
        'primary-lightest-color': {
            value: '$palette.blue.blue-lightest',
            type: 'color',
        },
        'primary-dark-color': {
            value: '$palette.blue.blue-dark',
            type: 'color',
        },
        'primary-darkest-color': {
            value: '$palette.blue.blue-darkest',
            type: 'color',
        },
        'secondary-color': {
            value: '{palette.gray.gray50}',
            type: 'color',
        },
        'secondary-light-color': {
            value: '{palette.gray.gray30}',
            type: 'color',
        },
        'secondary-lightest-color': {
            value: '{palette.gray.gray20}',
            type: 'color',
        },
        'secondary-dark-color': {
            value: '{palette.gray.gray60}',
            type: 'color',
        },
        'secondary-darkest-color': {
            value: '{palette.gray.gray70}',
            type: 'color',
        },
        'negative-color': {
            value: '{palette.red.red}',
            type: 'color',
        },
        'negative-light-color': {
            value: '{palette.red.red-light}',
            type: 'color',
        },
        'negative-lightest-color': {
            value: '{palette.red.red-lightest}',
            type: 'color',
        },
        'negative-dark-color': {
            value: '{palette.red.red-dark}',
            type: 'color',
        },
        'negative-darkest-color': {
            value: '{palette.red.red-darkest}',
            type: 'color',
        },
        'button-bg-halftone-color': {
            value: '$palette.white',
            description: 'Цвет бэкграунда аутлайновой кнопки',
            type: 'color',
        },
        'button-caption-disabled-color': {
            value: '$palette.gray.gray50',
            type: 'color',
        },
        'contrast-color': {
            value: '$palette.white',
            type: 'color',
        },
        'visited-color': {
            value: '#5214CC',
            type: 'color',
        },
        'info-color': {
            value: '$palette.blue.blue',
            type: 'color',
        },
        'info-hover-color': {
            value: '$palette.blue.blue-dark',
            type: 'color',
        },
        'info-active-color': {
            value: '$palette.blue.blue-darkest',
            type: 'color',
        },
        'success-color': {
            value: '$palette.green.green',
            type: 'color',
        },
        'success-hover-color': {
            value: '$palette.green.green-dark',
            type: 'color',
        },
        'success-active-color': {
            value: '$palette.green.green-darkest',
            type: 'color',
        },
        'warning-color': {
            value: '$palette.amber.amber',
            type: 'color',
        },
        'warning-hover-color': {
            value: '$palette.amber.amber-dark',
            type: 'color',
        },
        'warning-active-color': {
            value: '$palette.amber.amber-darkest',
            type: 'color',
        },
        'error-color': {
            value: '$palette.red.red',
            type: 'color',
        },
        'error-hover-color': {
            value: '$palette.red.red-dark',
            type: 'color',
        },
        'error-active-color': {
            value: '$palette.red.red-darkest',
            type: 'color',
        },
        'icon-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'icon-hover-color': {
            value: '$palette.gray.gray70',
            type: 'color',
        },
        'icon-active-color': {
            value: '$palette.gray.gray80',
            type: 'color',
        },
        'secondary-hover-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'secondary-active-color': {
            value: '$palette.gray.gray70',
            type: 'color',
        },
        'secondary-disabled-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'button-disabled-color': {
            value: '$palette.gray.gray50',
            type: 'color',
        },
        'disabled-color': {
            value: '$palette.gray.gray30',
            type: 'color',
        },
        'icon-disabled-color': {
            value: '$palette.gray.gray50',
            type: 'color',
        },
        'surface-color': {
            value: '$palette.white',
            type: 'color',
        },
        'surface-hover-color': {
            value: '$palette.gray.gray30',
            type: 'color',
        },
        'surface-dark-color': {
            value: '$palette.gray.gray90',
            type: 'color',
        },
        'surface-light-color': {
            value: '$palette.white',
            type: 'color',
        },
        'divider-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'text-brand-color': {
            value: '$palette.gray.gray90',
            type: 'color',
        },
        'text-primary-color': {
            value: '$palette.gray.gray80',
            type: 'color',
        },
        'text-secondary-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'text-disabled-color': {
            value: '$palette.gray.gray50',
            type: 'color',
        },
        'text-contrast-color': {
            value: '$palette.gray.gray5',
            type: 'color',
        },
        'input-bg-color': {
            value: '$palette.white',
            type: 'color',
        },
        'input-switch-bg-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'input-bg-checked-color': {
            value: '$core.primary-color',
            type: 'color',
        },
        'input-bg-checked-hover-color': {
            value: '$core.primary-dark-color',
            type: 'color',
        },
        'input-border-checked-disabled-color': {
            value: '$core.primary-light-color',
            type: 'color',
        },
        'input-border-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'input-bg-disabled-color': {
            value: '$palette.gray.gray5',
            type: 'color',
        },
        'input-bg-readonly-color': {
            value: '$palette.gray.gray5',
            type: 'color',
        },
        'input-border-checked-color': {
            value: '$core.primary-color',
            type: 'color',
        },
        'input-border-checked-hover-color': {
            value: '$core.primary-dark-color',
            type: 'color',
        },
        'input-border-checked-disabled-color-copy': {
            value: '$core.primary-light-color',
            type: 'color',
        },
        'input-border-hover-color': {
            value: '$core.primary-dark-color',
            type: 'color',
        },
        'input-switch-border-hover-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'input-textinput-border-hover-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'input-border-disabled-color': {
            value: '$core.disabled-color',
            type: 'color',
        },
        'input-border-readonly-color': {
            value: '$core.disabled-color',
            type: 'color',
        },
        'input-rest-color': {
            value: '$core.primary-color',
            type: 'color',
        },
        'input-hover-color': {
            value: '$core.primary-dark-color',
            type: 'color',
        },
        'input-active-color': {
            value: '$core.primary-darkest-color',
            type: 'color',
        },
        'input-label-color': {
            value: '$core.text-primary-color',
            type: 'color',
        },
        'input-label-disabled-color': {
            value: '$core.text-secondary-color',
            type: 'color',
        },
        'input-placeholder-color': {
            value: '$core.text-secondary-color',
            type: 'color',
        },
        'input-placeholder-disabled-color': {
            value: '$core.text-disabled-color',
            type: 'color',
        },
        'input-text-color': {
            value: '$core.text-primary-color',
            type: 'color',
        },
        'input-text-disabled-color': {
            value: '$core.text-disabled-color',
            type: 'color',
        },
        'input-icon-color': {
            value: '{palette.gray.gray50}',
            type: 'color',
        },
        'input-icon-disabled-color': {
            value: '{palette.gray.gray50}',
            type: 'color',
        },
        'input-checkbox-icon-color': {
            value: '{palette.white}',
            type: 'color',
        },
        'input-bg-checked-disabled-color': {
            value: '$core.primary-light-color',
            type: 'color',
        },
        'input-bg-hover-color': {
            value: '$palette.gray.gray60',
            type: 'color',
        },
        'tag-color': {
            value: '$palette.gray.gray30',
            type: 'color',
        },
        'tag-hover-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'skeleton-color': {
            value: '$palette.gray.gray40',
            type: 'color',
        },
        'skeleton-gradient': {
            value: 'linear-gradient(90deg, $palette.gray.gray40 0%, $palette.gray.gray10 50%, $palette.gray.gray40 100%)',
            description: '',
            type: 'color',
        },
        'overlay-color': {
            value: 'rgba(29, 30, 38, 0.8)',
            type: 'color',
        },
        shadow: {
            value: [
                {
                    x: '0',
                    y: '3',
                    blur: '6',
                    spread: '0',
                    color: 'rgba(29, 30, 38, 0.10)',
                    type: 'dropShadow',
                }, {
                    x: '0',
                    y: '1',
                    blur: '3',
                    spread: '0',
                    color: 'rgba(29, 30, 38, 0.10)',
                    type: 'dropShadow',
                },
            ],
            type: 'boxShadow',
        },
        'border-radius': {
            value: '0',
            type: 'sizing',
        },
    },
    button: {
        'button-color-primary': {
            'button-bg-color': {
                value: '$core.primary-color',
                type: 'color',
            },
            'button-bg-color-hover': {
                value: '$core.primary-dark-color',
                type: 'color',
            },
            'button-bg-color-active': {
                value: '$core.primary-darkest-color',
                type: 'color',
            },
            'button-bg-color-halftone': {
                value: '$core.button-bg-halftone-color',
                type: 'color',
            },
            'button-bg-color-halftone-hover': {
                value: '$core.primary-lightest-color',
                type: 'color',
            },
            'button-bg-color-halftone-active': {
                value: '$core.primary-light-color',
                type: 'color',
            },
            'button-border-color': {
                value: '$core.primary-color',
                type: 'color',
                description: '',
            },
            'button-border-color-hover': {
                value: '$core.primary-dark-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-border-color-active': {
                value: '$core.primary-darkest-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-bg-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
                description: 'Text & Icon color',
            },
            'button-border-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-caption-color': {
                value: '$core.contrast-color',
                type: 'color',
            },
            'button-caption-halftone-color': {
                value: '$core.primary-color',
                type: 'color',
                description: 'text and icon colors',
            },
            'button-caption-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'button-color-accent': {
            'button-bg-color': {
                value: '$core.accent-color',
                type: 'color',
            },
            'button-bg-color-hover': {
                value: '$core.accent-dark-color',
                type: 'color',
            },
            'button-bg-color-active': {
                value: '$core.accent-darkest-color',
                type: 'color',
            },
            'button-bg-color-halftone': {
                value: '$core.button-bg-halftone-color',
                type: 'color',
            },
            'button-bg-color-halftone-hover': {
                value: '$core.accent-lightest-color',
                type: 'color',
            },
            'button-bg-color-halftone-active': {
                value: '$core.accent-light-color',
                type: 'color',
            },
            'button-border-color': {
                value: '$core.accent-color',
                type: 'color',
            },
            'button-border-color-hover': {
                value: '$core.accent-dark-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-border-color-active': {
                value: '$core.accent-darkest-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-bg-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-border-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-caption-color': {
                value: '$core.contrast-color',
                type: 'color',
            },
            'button-caption-halftone-color': {
                value: '$core.accent-color',
                type: 'color',
            },
            'button-caption-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'button-color-negative': {
            'button-bg-color': {
                value: '$core.negative-color',
                type: 'color',
            },
            'button-bg-color-hover': {
                value: '$core.negative-dark-color',
                type: 'color',
            },
            'button-bg-color-active': {
                value: '$core.negative-darkest-color',
                type: 'color',
            },
            'button-bg-color-halftone': {
                value: '$core.button-bg-halftone-color',
                type: 'color',
            },
            'button-bg-color-halftone-hover': {
                value: '$core.negative-lightest-color',
                type: 'color',
            },
            'button-bg-color-halftone-active': {
                value: '$core.negative-light-color',
                type: 'color',
            },
            'button-border-color': {
                value: '$core.negative-color',
                type: 'color',
            },
            'button-border-color-hover': {
                value: '$core.negative-dark-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-border-color-active': {
                value: '$core.negative-darkest-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-bg-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-border-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-caption-color': {
                value: '$core.contrast-color',
                type: 'color',
            },
            'button-caption-halftone-color': {
                value: '$core.negative-color',
                type: 'color',
            },
            'button-caption-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'button-color-secondary': {
            'button-bg-color': {
                value: '$core.secondary-color',
                type: 'color',
            },
            'button-bg-color-hover': {
                value: '$core.secondary-dark-color',
                type: 'color',
            },
            'button-bg-color-active': {
                value: '$core.secondary-darkest-color',
                type: 'color',
            },
            'button-bg-color-halftone': {
                value: '$core.button-bg-halftone-color',
                type: 'color',
            },
            'button-bg-color-halftone-hover': {
                value: '$core.secondary-lightest-color',
                type: 'color',
            },
            'button-bg-color-halftone-active': {
                value: '$core.secondary-light-color',
                type: 'color',
            },
            'button-border-color': {
                value: '$core.secondary-color',
                type: 'color',
            },
            'button-border-color-hover': {
                value: '$core.secondary-dark-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-border-color-active': {
                value: '$core.secondary-darkest-color',
                type: 'color',
                description: 'Only for FE developers for Solid buttons',
            },
            'button-bg-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-border-color-disabled': {
                value: '$core.disabled-color',
                type: 'color',
            },
            'button-caption-color': {
                value: '$core.contrast-color',
                type: 'color',
            },
            'button-caption-halftone-color': {
                value: '$core.secondary-dark-color',
                type: 'color',
            },
            'button-caption-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'button-vars': {
            'button-border-radius': {
                value: '{core.border-radius}',
                type: 'borderRadius',
            },
        },
    },
    'icon-button': {
        'icon-button-color-info': {
            'icon-button-icon-color': {
                value: '$core.info-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.info-hover-color',
                type: 'color',
            },
            'icon-button-icon-color-active': {
                value: '$core.info-active-color',
                type: 'color',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'icon-button-color-success': {
            'icon-button-icon-color': {
                value: '$core.success-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.success-hover-color',
                type: 'color',
            },
            'icon-button-icon-color-active': {
                value: '$core.success-active-color',
                type: 'color',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'icon-button-color-warning': {
            'icon-button-icon-color': {
                value: '$core.warning-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.warning-hover-color',
                type: 'color',
            },
            'icon-button-icon-color-active': {
                value: '$core.warning-active-color',
                type: 'color',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'icon-button-color-error': {
            'icon-button-icon-color': {
                value: '$core.error-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.error-hover-color',
                type: 'color',
            },
            'icon-button-icon-color-active': {
                value: '$core.error-active-color',
                type: 'color',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'icon-button-color-default': {
            'icon-button-icon-color': {
                value: '$core.icon-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.icon-hover-color',
                type: 'color',
            },
            'icon-button-icon-color-active': {
                value: '$core.icon-active-color',
                type: 'color',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
        'icon-button-color-secondary': {
            'icon-button-icon-color': {
                value: '$core.secondary-color',
                type: 'color',
            },
            'icon-button-icon-color-hover': {
                value: '$core.icon-hover-color',
                type: 'color',
                description: 'Check on FE',
            },
            'icon-button-icon-color-active': {
                value: '$core.icon-active-color',
                type: 'color',
                description: 'Check on FE',
            },
            'icon-button-icon-color-disabled': {
                value: '$core.button-caption-disabled-color',
                type: 'color',
            },
        },
    },
    'link-button': {
        'link-button-vars': {
            'link-button-text-color': {
                value: '$core.info-color',
                type: 'color',
            },
            'link-button-text-color-hover': {
                value: '$core.info-hover-color',
                type: 'color',
            },
            'link-button-text-color-active': {
                value: '$core.info-active-color',
                type: 'color',
            },
            'link-button-text-color-disabled': {
                value: '$core.button-caption-disabled-color',
                description: 'Check on FE',
                type: 'color',
            },
        },
    },
    'tab-button': {
        'tab-button-vars': {
            'tab-button-text-color': {
                value: '$core.text-primary-color',
                type: 'color',
            },
            'tab-button-text-color-hover': {
                value: '$core.primary-color',
                type: 'color',
            },
            'tab-button-text-color-active': {
                value: '$core.primary-color',
                type: 'color',
            },
            'tab-button-text-color-disabled': {
                value: '$core.text-disabled-color',
                type: 'color',
            },
            'tab-button-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'tab-button-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
    },
    checkbox: {
        'checkbox-vars': {
            'checkbox-border-color': {
                value: '$core.input-border-color',
                type: 'color',
            },
            'checkbox-border-color-hover': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'checkbox-border-color-disabled': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'checkbox-border-color-checked': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'checkbox-border-color-checked-disabled': {
                value: '$core.input-border-checked-disabled-color',
                type: 'color',
            },
            'checkbox-bg-color': {
                value: '$core.input-bg-color',
                type: 'color',
            },
            'checkbox-bg-color-checked': {
                value: '$core.input-bg-checked-color',
                type: 'color',
            },
            'checkbox-bg-color-disabled': {
                value: '$core.input-bg-disabled-color',
                type: 'color',
            },
            'checkbox-bg-color-checked-hover': {
                value: '$core.input-bg-checked-hover-color',
                type: 'color',
            },
            'checkbox-bg-color-checked-disabled': {
                value: '$core.input-bg-checked-disabled-color',
                type: 'color',
            },
            'checkbox-error-color': {
                value: '$core.negative-color',
                type: 'color',
            },
            'checkbox-fill-color': {
                value: '$core.input-checkbox-icon-color',
                type: 'color',
            },
            'checkbox-label-color': {
                value: '$core.input-label-color',
                type: 'color',
            },
            'checkbox-label-color-disabled': {
                value: '$core.input-label-disabled-color',
                type: 'color',
            },
            'checkbox-border-radius': {
                value: '{core.border-radius}',
                type: 'borderRadius',
            },
        },
    },
    'radio-input': {
        'radio-input-vars': {
            'radio-input-bg-color': {
                value: '$core.input-bg-color',
                type: 'color',
            },
            'radio-input-bg-color-disabled': {
                value: '$core.input-bg-disabled-color',
                type: 'color',
            },
            'radio-input-border-color': {
                value: '$core.input-border-color',
                type: 'color',
            },
            'radio-input-border-color-checked': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'radio-input-border-color-hover': {
                value: '$core.input-border-hover-color',
                type: 'color',
            },
            'radio-input-border-color-disabled': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'radio-input-border-color-checked-disabled': {
                value: '$core.input-border-checked-disabled-color',
                type: 'color',
            },
            'radio-input-label-color': {
                value: '$core.input-label-color',
                type: 'color',
            },
            'radio-input-label-color-disabled': {
                value: '$core.input-label-disabled-color',
                type: 'color',
            },
            'radio-input-fill-color-checked': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'radio-input-fill-color-hover': {
                value: '$core.input-border-hover-color',
                type: 'color',
            },
            'radio-input-fill-color-checked-disabled': {
                value: '$core.input-border-checked-disabled-color',
                type: 'color',
            },
            'radio-input-error-color': {
                value: '$core.negative-color',
                type: 'color',
            },
        },
    },
    switch: {
        'switch-vars': {
            'switch-bg-color': {
                value: '$core.input-switch-bg-color',
                type: 'color',
            },
            'switch-bg-color-checked': {
                value: '$core.input-bg-checked-color',
                type: 'color',
            },
            'switch-bg-color-hover': {
                value: '$core.input-bg-hover-color',
                type: 'color',
            },
            'switch-bg-color-disabled': {
                value: '$core.input-bg-disabled-color',
                type: 'color',
            },
            'switch-bg-color-checked-hover': {
                value: '$core.input-bg-checked-hover-color',
                type: 'color',
            },
            'switch-bg-color-checked-disabled': {
                value: '$core.input-bg-checked-disabled-color',
                type: 'color',
            },
            'switch-border-color': {
                value: '$core.input-border-color',
                type: 'color',
            },
            'switch-border-color-checked': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'switch-border-color-hover': {
                value: '$core.input-switch-border-hover-color',
                type: 'color',
            },
            'switch-border-color-disabled': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'switch-border-color-checked-hover': {
                value: '$core.input-border-checked-hover-color',
                type: 'color',
            },
            'switch-border-color-checked-hover-copy': {
                value: '$core.input-border-checked-hover-color',
                type: 'color',
            },
            'switch-border-color-checked-disabled': {
                value: '$core.input-border-checked-disabled-color',
                type: 'color',
            },
            'switch-label-color': {
                value: '$core.input-label-color',
                type: 'color',
            },
            'switch-label-color-disabled': {
                value: '$core.input-label-disabled-color',
                type: 'color',
            },
            'switch-toggler-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'switch-toggler-bg-color-disabled': {
                value: '$core.input-bg-disabled-color',
                type: 'color',
            },
            'switch-toggler-border-color': {
                value: '$core.input-switch-bg-color',
                type: 'color',
            },
            'switch-toggler-border-color-checked': {
                value: '$core.input-bg-checked-color',
                type: 'color',
            },
            'switch-toggler-border-color-hover': {
                value: '$core.input-bg-hover-color',
                type: 'color',
            },
            'switch-toggler-border-color-disabled': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'switch-toggler-border-color-checked-hover': {
                value: '$core.input-bg-checked-hover-color',
                type: 'color',
            },
            'switch-toggler-border-color-checked-disabled': {
                value: '$core.input-bg-checked-disabled-color',
                type: 'color',
            },
        },
    },
    'text-input': {
        'text-input-vars': {
            'text-input-bg-color': {
                value: '$core.input-bg-color',
                type: 'color',
            },
            'text-input-bg-color-disabled': {
                value: '$core.input-bg-disabled-color',
                type: 'color',
            },
            'text-input-bg-color-readonly': {
                value: '$core.input-bg-readonly-color',
                type: 'color',
            },
            'text-input-border-color': {
                value: '$core.input-border-color',
                type: 'color',
            },
            'text-input-border-color-hover': {
                value: '$core.input-textinput-border-hover-color',
                type: 'color',
            },
            'text-input-border-color-active': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'text-input-border-color-error': {
                value: '$core.negative-color',
                type: 'color',
            },
            'text-input-border-color-disabled': {
                value: '$core.input-border-disabled-color',
                type: 'color',
            },
            'text-input-border-color-readonly': {
                value: '$core.input-border-readonly-color',
                type: 'color',
            },
            'text-input-placeholder-color': {
                value: '$core.input-placeholder-color',
                type: 'color',
            },
            'text-input-placeholder-color-disabled': {
                value: '$core.input-placeholder-disabled-color',
                type: 'color',
            },
            'text-input-text-color': {
                value: '$core.input-text-color',
                type: 'color',
            },
            'text-input-text-color-disabled': {
                value: '$core.input-text-disabled-color',
                type: 'color',
            },
            'text-input-icon-color': {
                value: '$core.input-icon-color',
                type: 'color',
            },
            'text-input-icon-color-disabled': {
                value: '$core.input-icon-disabled-color',
                type: 'color',
            },
            'text-input-icon-color-clickable': {
                value: '$core.icon-color',
                type: 'color',
            },
            'text-input-icon-color-clickable-hover': {
                value: '$core.icon-hover-color',
                type: 'color',
            },
            'text-input-border-radius': {
                value: '{core.border-radius}',
                type: 'borderRadius',
            },
        },
    },
    accordion: {
        'accordion-vars': {
            'accordion-bg-color': {
                value: '$core.surface-color',
                type: 'color',
            },
            'accordion-border-color': {
                value: '$core.divider-color',
                type: 'color',
            },
            'accordion-text-color': {
                value: '$core.text-primary-color',
                type: 'color',
            },
            'accordion-text-color-disabled': {
                value: '$core.text-color-disabled',
                type: 'color',
            },
            'accordion-icon-color': {
                value: '$core.icon-color',
                type: 'color',
            },
            'accordion-icon-color-disabled': {
                value: '$core.iconButton-disabled-color',
                type: 'color',
            },
            'accordion-shadow': {
                value: '0 3px 6px 0 rgba(29, 30, 38, 0.10), 0 1px 3px 0 rgba(29, 30, 38, 0.10)',
                type: 'boxShadow',
            },
            'accordion-shadow-hovered': {
                value: '0 6px 12px 0 rgba(29, 30, 38, 0.10), 0 3px 6px 0 rgba(29, 30, 38, 0.10)',
                type: 'boxShadow',
            },
        },
    },
    'icon-container': {
        'icon-container-color-info': {
            'icon-container-fill-color': {
                value: '$core.info-color',
                type: 'color',
            },
        },
        'icon-container-color-success': {
            'icon-container-fill-color': {
                value: '$core.success-color',
                type: 'color',
            },
        },
        'icon-container-color-warning': {
            'icon-container-fill-color': {
                value: '$core.warning-color',
                type: 'color',
            },
        },
        'icon-container-color-error': {
            'icon-container-fill-color': {
                value: '$core.error-color',
                type: 'color',
            },
        },
        'icon-container-color-default': {
            'icon-container-fill-color': {
                value: '$core.icon-color',
                type: 'color',
            },
        },
        'icon-container-color-secondary': {
            'icon-container-fill-color': {
                value: '$core.secondary-color',
                type: 'color',
            },
        },
    },
    'labeled-input': {
        'labeled-input-vars': {
            'input-label-color': {
                value: '$core.text-primary-color',
                type: 'color',
            },
            'input-label-color-disabled': {
                value: '$core.text-disabled-color',
                type: 'color',
            },
            'input-label-color-error': {
                value: '$core.error-color',
                type: 'color',
            },
            'input-label-fill-color': {
                value: '$core.icon-color',
                type: 'color',
            },
            'input-label-optional-text-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
            'input-label-asterisk-color': {
                value: '$core.error-color',
                type: 'color',
            },
        },
    },
    panel: {
        'panel-vars': {
            'panel-border-radius': {
                value: '$core.border-radius',
                type: 'sizing',
            },
            'panel-bg-color': {
                value: '$core.surface-color',
                type: 'color',
            },
            'panel-shadow': {
                value: '$core.shadow',
                type: 'boxShadow',
            },
        },
    },
    'scroll-bars': {
        'scroll-bars-vars': {
            'scroll-bars-bg-color': {
                value: '#CED0DB',
                type: 'color',
            },
            'scroll-bars-bg-color-active': {
                value: '#6C6F80',
                type: 'color',
            },
        },
    },
    'dropdown-container': {
        'dropdown-container-vars': {
            'dropdown-container-shadow': {
                value: '$core.shadow',
                type: 'boxShadow',
            },
            'dropdown-container-scrollbar-thumb-color': {
                value: '#6C6F80',
                type: 'color',
            },
        },
    },
    modals: {
        'modals-vars': {
            'modals-border-radius': {
                value: '$core.border-radius',
                type: 'sizing',
            },
            'modals-overlay-color': {
                value: 'rgba(29, 30, 38, 0.8)',
                type: 'color',
            },
            'modals-shadow': {
                value: '0 6px 18px 0 rgba(29, 30, 38, 0.05), 0 3px 12px 0 rgba(29, 30, 38, 0.05)',
                type: 'boxShadow',
            },
            'modals-bg-color': {
                value: '$core.surface-color',
                type: 'color',
            },
        },
    },
    'notification-card': {
        'notification-card-warning': {
            'notification-card-fill-color': {
                value: '$core.warning-color',
                type: 'color',
            },
            'notification-card-border-color': {
                value: '$core.warning-color',
                type: 'color',
            },
            'notification-card-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
        },
        'notification-card-success': {
            'notification-card-fill-color': {
                value: '$core.success-color',
                type: 'color',
            },
            'notification-card-border-color': {
                value: '$core.success-color',
                type: 'color',
            },
            'notification-card-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
        },
        'notification-card-info': {
            'notification-card-fill-color': {
                value: '$core.info-color',
                type: 'color',
            },
            'notification-card-border-color': {
                value: '$core.info-color',
                type: 'color',
            },
            'notification-card-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
        },
        'notification-card-error': {
            'notification-card-fill-color': {
                value: '$core.error-color',
                type: 'color',
            },
            'notification-card-border-color': {
                value: '$core.error-color',
                type: 'color',
            },
            'notification-card-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
        },
        'notification-card-vars': {
            'notification-card-border-radius': {
                value: '{core.border-radius}',
                type: 'borderRadius',
            },
        },
    },
    tooltip: {
        'tooltip-vars': {
            'tooltip-shadow': {
                value: '$core.shadow',
                type: 'boxShadow',
            },
            'tooltip-arrow-shadow': {
                value: '0 1px 4px 0 rgba(0, 0, 0, 0.2)',
                type: 'boxShadow',
            },
            'tooltip-bg-color': {
                value: '{core.surface-dark-color}',
                type: 'color',
            },
            'tooltip-text-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'tooltip-border-radius': {
                value: '{core.border-radius}',
                type: 'borderRadius',
            },
        },
    },
    'picker-toggler': {
        'picker-toggler-vars': {
            'picker-toggler-bg-color': {
                value: '$core.input-bg-color',
                type: 'color',
            },
            'picker-toggler-border-color': {
                value: '$core.input-border-color',
                type: 'color',
            },
            'picker-toggler-border-color-hover': {
                value: '$core.input-textinput-border-hover-color',
                type: 'color',
            },
            'picker-toggler-border-color-active': {
                value: '$core.input-border-checked-color',
                type: 'color',
            },
            'picker-toggler-border-color-error': {
                value: '$core.negative-color',
                type: 'color',
            },
            'picker-toggler-placeholder-color': {
                value: '$core.input-placeholder-color',
                type: 'color',
            },
            'picker-toggler-text-color': {
                value: '$core.input-text-color',
                type: 'color',
            },
            'picker-toggler-text-color-disabled': {
                value: '$core.input-text-disabled-color',
                type: 'color',
            },
            'picker-toggler-icon-color': {
                value: '$core.input-icon-color',
                type: 'color',
            },
            'picker-toggler-icon-color-disabled': {
                value: '$core.input-icon-disabled-color',
                type: 'color',
            },
            'picker-toggler-icon-color-clickable': {
                value: '$core.icon-color',
                type: 'color',
            },
            'picker-toggler-icon-color-clickable-hover': {
                value: '$core.icon-hover-color',
                type: 'color',
            },
            'picker-toggler-border-radius': {
                value: '$core.border-radius',
                type: 'sizing',
            },
        },
    },
    text: {
        'text-color-brand': {
            'text-color': {
                value: '$core.text-brand-color',
                type: 'color',
            },
        },
        'text-color-primary': {
            'text-color': {
                value: '$core.text-primary-color',
                type: 'color',
            },
        },
        'text-color-secondary': {
            'text-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
        'text-color-disabled': {
            'text-color': {
                value: '$core.text-disabled-color',
                type: 'color',
            },
        },
        'text-color-contrast': {
            'text-color': {
                value: '$core.text-contrast-color',
                type: 'color',
            },
        },
    },
    'text-placeholder': {
        'text-placeholder-vars': {
            'text-placeholder-gradient': {
                value: '$core.skeleton-gradient',
                type: 'color',
            },
            'text-placeholder-color': {
                value: '$core.skeleton-color',
                type: 'color',
            },
        },
    },
    badge: {
        'badge-color-info': {
            'badge-bg-color': {
                value: '$core.info-color',
                type: 'color',
            },
            'badge-bg-color-hover': {
                value: '$core.info-active-color',
                type: 'color',
            },
            'badge-caption-color-solid': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
        'badge-color-success': {
            'badge-bg-color': {
                value: '$core.success-color',
                type: 'color',
            },
            'badge-bg-color-hover': {
                value: '$core.success-active-color',
                type: 'color',
            },
            'badge-caption-color-solid': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
        'badge-color-warning': {
            'badge-bg-color': {
                value: '$core.warning-color',
                type: 'color',
            },
            'badge-bg-color-hover': {
                value: '$core.warning-active-color',
                type: 'color',
            },
            'badge-caption-color-solid': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
        'badge-color-error': {
            'badge-bg-color': {
                value: '$core.error-color',
                type: 'color',
            },
            'badge-bg-color-hover': {
                value: '$core.error-active-color',
                type: 'color',
            },
            'badge-caption-color-solid': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'badge-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
    },
    tag: {
        'tag-vars': {
            'tag-bg-color': {
                value: '$core.tag-color',
                type: 'color',
            },
            'tag-bg-color-hover': {
                value: '$core.tag-hover-color',
                type: 'color',
            },
            'tag-caption-color': {
                value: '$core.text-primary-color',
                type: 'color',
            },
            'tag-fill-color': {
                value: '$core.icon-color',
                type: 'color',
            },
            'tag-fill-color-hover': {
                value: '$core.icon-hover-color',
                type: 'color',
            },
            'tag-count-bg-color': {
                value: '#FFFFFF',
                type: 'color',
            },
            'tag-count-color': {
                value: '$core.text-secondary-color',
                type: 'color',
            },
        },
    },
};
