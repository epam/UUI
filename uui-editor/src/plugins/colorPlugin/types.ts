import { WithFloatingButtonPlugin } from '../../implementation/Toolbars';

export type ColorValueHex = `#${string}`;

type DefaultColorVar = 'var(--uui-text-critical)' | 'var(--uui-text-warning)' | 'var(--uui-text-success)';

export type ColorPluginOptions = WithFloatingButtonPlugin & {
    colors: (ColorValueHex | DefaultColorVar)[];
};
