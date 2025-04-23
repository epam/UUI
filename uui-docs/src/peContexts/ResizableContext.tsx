import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DemoComponentProps } from '../types';
import { Slider } from '@epam/uui';
//
import css from './ResizableContext.module.scss';
import cx from 'classnames';

ResizableContext.displayName = 'Resizable';
export function ResizableContext(props: DemoComponentProps) {
    const [state, setState] = useState<{ widthPercent: number }>({ widthPercent: 100 });
    const { DemoComponent, isPreview } = props;
    const elementRef = useRef<HTMLDivElement>(undefined);
    const key = useElementWidth(elementRef);

    const resizeHandler = useCallback((value: number) => {
        setState((prev) => ({
            ...prev,
            widthPercent: value,
        }));
    }, []);

    return (
        <div className={ cx([css.panel, isPreview && css.preview]) } ref={ elementRef }>
            <div className={ css.slider }>
                <Slider key={ key } value={ state.widthPercent } onValueChange={ resizeHandler } min={ 0 } max={ 100 } step={ 1 } />
            </div>
            <div style={ { width: `${state.widthPercent}%` } }>
                <DemoComponent { ...props.props } />
            </div>
        </div>
    );
}

function useElementWidth(elementRef: React.RefObject<HTMLElement | null>) {
    const [width, setWidth] = useState<number | undefined>();
    useEffect(() => {
        if (elementRef.current) {
            const observer = new ResizeObserver((entries) => {
                if (entries?.length) {
                    setWidth(entries[0].contentRect.width);
                }
            });
            observer.observe(elementRef.current);
            return () => {
                elementRef.current && observer.unobserve(elementRef.current);
                observer.disconnect();
            };
        }
    }, [elementRef]);
    return width;
}
