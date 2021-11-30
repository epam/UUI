import * as React from 'react';
import { Icon, IHasCX } from '@epam/uui';

interface SvgProps extends IHasCX {
    svg?: Icon;
    fillColor?: string;
    width?: number;
    height?: number;
}

export class Svg extends React.Component<SvgProps> {
    render() {
        const { svg, cx, fillColor } = this.props;
        if (!svg) {
            return null;
        }
        const svgProps = {
            className: cx,
            fill: fillColor,
        };

        return React.createElement(svg as React.FC<any>, svgProps);
    }
}
