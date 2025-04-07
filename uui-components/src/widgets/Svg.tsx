import * as React from 'react';
import cx from 'classnames';
import { Icon, IHasCX, IHasRawProps } from '@epam/uui-core';

interface ISvgProps {
    className: string;
    fill?: string;
    height?: number | string;
    width?: number | string;
}

interface SvgProps extends IHasCX, IHasRawProps<React.SVGAttributes<SVGSVGElement>>, React.RefAttributes<SVGSVGElement> {
    svg?: Icon;
    fillColor?: string;
    width?: number | string;
    height?: number | string;
}

export function Svg(props: SvgProps) {
    if (!props.svg) return null;

    const {
        svg, fillColor, height, width,
    } = props;

    const svgProps: ISvgProps = {
        className: cx(props.cx),
        fill: fillColor,
        ...props.rawProps,
    };

    if (height !== undefined) svgProps.height = height;
    if (width !== undefined) svgProps.width = width;

    return React.createElement(svg, { ...svgProps, ref: props.ref });
}
