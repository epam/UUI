import * as React from 'react';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import css from './SvgCircleProgress.module.scss';

interface SvgCircleProgressProps extends IHasCX, IHasRawProps<React.SVGAttributes<SVGSVGElement>> {
    /*
    * Defines component size.
    */
    size: number;
    /*
    * Defines progress in numbers.
    */
    progress: number;
}

export const SvgCircleProgress = /* @__PURE__ */React.forwardRef<SVGSVGElement, SvgCircleProgressProps>((props, ref) => {
    const outsetRadius = props.size / 2 - 1;
    const insetRadius = props.size / 2 - 3;
    const circumference = insetRadius * Math.PI;

    return (
        <svg className={ css.root } width={ props.size } height={ props.size } ref={ ref } { ...props.rawProps }>
            <circle
                strokeDasharray={ circumference }
                strokeDashoffset={ circumference - (props.progress / 100) * circumference }
                strokeWidth={ insetRadius }
                fill="transparent"
                r={ insetRadius / 2 }
                cx={ props.size / 2 }
                cy={ props.size / 2 }
            />
            <circle
                strokeWidth={ 1 }
                fill="transparent"
                r={ outsetRadius }
                cx={ props.size / 2 }
                cy={ props.size / 2 }
            />
        </svg>
    );
});
