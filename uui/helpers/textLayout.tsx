import { ControlSize } from '../components/types';
import { settings } from '../settings';
import css from './text-layout.module.scss';

export interface TextSettings {
    /** Defines text line-height */
    lineHeight?: '12' | '18' | '24' | '30';
    /** Defines text font-size */
    fontSize?: '10' | '12' | '14' | '16' | '18' | '24';
}

export function getTextClasses(props: TextSettings & { size: 'none' | '18' | ControlSize | '60' }, border: boolean) {
    if (props.size === 'none') {
        return [css['line-height-' + props.lineHeight], css['font-size-' + props.fontSize]];
    }

    const setting = {
        size: props.size,
        lineHeight: props.lineHeight || settings.sizes.text[props.size].lineHeight,
        fontSize: props.fontSize || settings.sizes.text[props.size].fontSize,
    };

    const vPadding = (+setting.size - +setting.lineHeight - (border ? 2 : 0)) / 2;

    return [
        css['line-height-' + setting.lineHeight], css['font-size-' + setting.fontSize], css['v-padding-' + vPadding],
    ];
}
