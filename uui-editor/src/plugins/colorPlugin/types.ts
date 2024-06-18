import { WithFloatingButtonPlugin } from '../../implementation/Toolbars';

export type ColorValueHex = `#${string}` | `var(--${string})`;

export type ColorPluginOptions = WithFloatingButtonPlugin & {
    colors: ColorValueHex[];
};
