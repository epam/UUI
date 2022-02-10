import * as React from 'react';
import { Icon, IHasCX } from '@epam/uui-core';

interface SvgProps extends IHasCX {
    svg?: Icon;
    fillColor?: string;
    width?: number;
    height?: number;
}

export class Svg extends React.Component<SvgProps> {
    render() {
        const { svg, cx, fillColor, height, width } = this.props;
        if (!svg) return null;
        
        const svgProps: ISvgProps = {
            className: cx,
            fill: fillColor,
        };
        
        if (height !== undefined) svgProps.height = height;
        if (width !== undefined) svgProps.width = width;

        return React.createElement(svg as React.FC<any>, svgProps);
    }
}

interface ISvgProps {
    className: string;
    fill: string;
    height?: number;
    width?: number;
}