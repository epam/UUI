import * as React from 'react';
import * as css from './SvgCircleProgress.scss';
import { IHasCX } from '@epam/uui';

interface SvgCircleProgressProps extends IHasCX {
    size: number;
    progress: number;
}

export class SvgCircleProgress extends React.Component<SvgCircleProgressProps> {
    outsetRadius = this.props.size / 2 - 1;
    insetRadius = this.props.size / 2 - 3;
    circumference = this.insetRadius * Math.PI;
    render() {
        return (
            <svg className={ css.root } width={ this.props.size } height={ this.props.size } >
                <circle
                    stroke={ '#ACAFBF' }
                    strokeDasharray={ this.circumference }
                    strokeDashoffset={ this.circumference - (this.props.progress / 100 * this.circumference) }
                    strokeWidth={ this.insetRadius }
                    fill='transparent'
                    r={ this.insetRadius / 2 }
                    cx={ this.props.size / 2 }
                    cy={ this.props.size / 2 }
                />
                <circle
                    stroke={ '#ACAFBF' }
                    strokeWidth={ 1 }
                    fill='transparent'
                    r={ this.outsetRadius }
                    cx={ this.props.size / 2 }
                    cy={ this.props.size / 2 }
                />
            </svg>
        );
    }
}