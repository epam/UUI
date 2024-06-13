import { WithFloatingButtonPlugin } from '../../implementation/Toolbars';

export type ColorValueHex = `#${string}`;

export type ColorPluginOptions = WithFloatingButtonPlugin & {
    colors?: ColorValueHex[];
};
