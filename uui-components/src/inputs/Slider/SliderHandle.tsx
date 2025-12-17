import * as React from 'react';
import { IHasCX, uuiElement, cx, IHasRawProps } from '@epam/uui-core';
import css from './SliderHandle.module.scss';
import { useFloating, arrow, autoUpdate } from '@floating-ui/react';
import { Portal } from '../../overlays';
import { uuiSlider } from './SliderBase';

interface SliderHandleProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    onUpdate(mouseX: number): void;
    onKeyDownUpdate?(type: 'right' | 'left'): void;
    handleActiveState?(isActive: boolean): void;
    tooltipContent: number;
    isActive: boolean;
    offset: number;
    showTooltip?: boolean;
}

export const SliderHandle: React.FC<SliderHandleProps> = (props) => {
    const {
        onUpdate,
        onKeyDownUpdate,
        handleActiveState,
        tooltipContent,
        isActive,
        offset: handleOffset,
        showTooltip,
        cx: propsCx,
        rawProps,
    } = props;

    const [isHovered, setIsHovered] = React.useState(false);
    const sliderHandleRef = React.useRef<HTMLDivElement | null>(null);
    const arrowRef = React.useRef<HTMLDivElement | null>(null);
    const updateTooltipRafRef = React.useRef<number | null>(null);

    const { refs, floatingStyles, placement, update } = useFloating({
        placement: 'top',
        middleware: [
            arrow({ element: arrowRef }),
        ],
        whileElementsMounted: autoUpdate,
        open: showTooltip && (isActive || isHovered),
    });

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isActive) {
                onUpdate(e.clientX);

                if (updateTooltipRafRef.current === null) {
                    updateTooltipRafRef.current = requestAnimationFrame(() => {
                        update();
                        updateTooltipRafRef.current = null;
                    });
                }
            }
        };

        const handleMouseUp = () => {
            if (isActive) {
                handleActiveState?.(false);
            }
        };

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        sliderHandleRef.current?.addEventListener('mouseenter', handleMouseEnter);
        sliderHandleRef.current?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (updateTooltipRafRef.current !== null) {
                cancelAnimationFrame(updateTooltipRafRef.current);
                updateTooltipRafRef.current = null;
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            sliderHandleRef.current?.removeEventListener('mouseenter', handleMouseEnter);
            sliderHandleRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isActive, onUpdate, handleActiveState, update]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        handleActiveState?.(true);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        e.preventDefault();
        handleActiveState?.(true);
        setIsHovered(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
        e.preventDefault();
        handleActiveState?.(false);
        setIsHovered(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'ArrowLeft') {
            onKeyDownUpdate?.('left');
        } else if (e.key === 'ArrowRight') {
            onKeyDownUpdate?.('right');
        }
    };

    const tooltip = React.useMemo(() => {
        if (!showTooltip || (!isActive && !isHovered)) return null;

        return (
            <Portal>
                <div
                    ref={ refs.setFloating }
                    style={ floatingStyles }
                    className={ cx(propsCx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                    data-placement={ placement }
                >
                    <div className={ cx(uuiElement.tooltipBody, css.tooltipBodyWithArrow) }>
                        { tooltipContent }
                    </div>
                    <div ref={ arrowRef } className={ uuiElement.tooltipArrow } />
                </div>
            </Portal>
        );
    }, [showTooltip, isActive, isHovered, floatingStyles, tooltipContent, propsCx, refs.setFloating, placement]);

    const setRefs = React.useCallback(
        (node: HTMLDivElement | null) => {
            sliderHandleRef.current = node;
            refs.setReference(node);
        },
        [refs],
    );

    return (
        <>
            <div
                role="slider"
                aria-valuenow={ tooltipContent }
                tabIndex={ 0 }
                ref={ setRefs }
                className={ cx(uuiSlider.handle, propsCx) }
                style={ { transform: `translateX(${handleOffset || 0}px)` } }
                onMouseDown={ handleMouseDown }
                onKeyDown={ handleKeyDown }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
                { ...rawProps }
            />
            {tooltip}
        </>
    );
};
