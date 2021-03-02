import * as React from 'react';
import { Icon, IHasCX, SvgDescriptor, parseIconViewbox } from '@epam/uui';

interface SvgProps extends IHasCX {
    svg?: Icon;
    fillColor?: string;
    width?: number;
    height?: number;
}

export class Svg extends React.Component<SvgProps> {
    render() {
        if (!this.props.svg) {
            return null;
        }

        let svgElement: React.ReactNode;

        if ((this.props.svg as SvgDescriptor).viewBox) {
            let svg = this.props.svg as SvgDescriptor;
            const viewBox = parseIconViewbox(svg.viewBox);
            const attrs = {
                width: this.props.width ? this.props.width : viewBox.w,
                height: this.props.height ? this.props.height : viewBox.h,
            };

            svgElement = <svg viewBox={ svg.viewBox } { ...attrs } className={ this.props.cx } fill={ this.props.fillColor }>
                            <use xlinkHref={ svg.url || ('#' + svg.id) } />
                        </svg>;
        } else {
            const svgProps = {
                className: this.props.cx,
                fill: this.props.fillColor,
            };

            svgElement = React.createElement(this.props.svg as React.SFC<any>, svgProps);
        }

        return svgElement;
    }
}
