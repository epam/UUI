import React, { useLayoutEffect, useRef, useState } from 'react';
import { colorToHex } from '../../utils/colorUtils';
import css from './colorRectangle.module.scss';

export function ColorRectangle(
    props: {
        color: string,
        calcColor: boolean,
        renderLabel: (actualHex: string | undefined) => React.ReactNode[]
    },
) {
    const rectangleRef = useRef<HTMLDivElement>();
    const [actualHex, setActualHex] = useState<string | undefined>();
    useLayoutEffect(() => {
        if (rectangleRef.current && props.calcColor) {
            const computed = getComputedStyle(rectangleRef.current).backgroundColor;
            const hex = colorToHex(computed);
            setActualHex(hex);
        } else {
            setActualHex(undefined);
        }
    }, [props.calcColor, rectangleRef]);
    const style = {
        backgroundColor: props.color,
    };
    const lines = props.renderLabel(actualHex);
    return (
        <>
            <div style={ style } ref={ rectangleRef } className={ css.root }>
                &nbsp;
            </div>
            <div className={ css.label }>
                {
                    lines.map((node, i) => {
                        return (
                            <React.Fragment key={ i }>
                                {node}
                                { i < lines.length - 1 && <br /> }
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </>
    );
}
