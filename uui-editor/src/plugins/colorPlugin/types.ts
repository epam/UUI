import { WithFloatingButtonPlugin } from '../../implementation/Toolbars';

export type ColorValueHex = `#${string}` | `var(--${string})`;

export type ColorConfig = {
    colors?: ColorValueHex[];
};

export type ColorPluginOptions = WithFloatingButtonPlugin & Required<ColorConfig>;
