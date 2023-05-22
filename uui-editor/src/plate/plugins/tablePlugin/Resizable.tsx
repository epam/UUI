import React, { MouseEventHandler, useEffect, useState } from "react";
import {
    ELEMENT_TABLE,
    HTMLPropsAs,
    ResizeHandleProps,
    TTableElement,
    TableCellElementResizableProps,
    TablePlugin,
    createComponentAs,
    createElementAs,
    getPluginOptions,
    getTableEntries,
    useElement,
    usePlateEditorRef,
    usePlateEditorState,
    useTableCellElementResizableProps,
} from "@udecode/plate";
import { ExtendedTTableCellElement } from "./types";

export const useResizeHandleProps: (props: ResizeHandleProps) => HTMLPropsAs<"div"> = ({
    direction,
    width = 10,
    startMargin = 0,
    endMargin = 0,
    zIndex = 40,
    onResize,
    onMouseDown,
    onHover,
    onHoverEnd,
    style,
    ...props
}) => {
    const [isResizing, setIsResizing] = useState(false);
    const [initialPosition, setInitialPosition] = useState(0);
    const [initialSize, setInitialSize] = useState(0);
    const editor = usePlateEditorState();

    const cellElement = useElement<ExtendedTTableCellElement>();
    const { table } = getTableEntries(editor) || {};

    const isHorizontal = direction === "left" || direction === "right";

    const handleMouseDown: MouseEventHandler = (event) => {
        const { clientX, clientY } = event;
        setInitialPosition(isHorizontal ? clientX : clientY);

        const element = (event.target as HTMLElement).parentElement!;

        // TODO: move to plate
        let size;
        if (isHorizontal) {
            size = element.offsetWidth;
            if (table && cellElement && cellElement.colSpan > 1) {
                const tableElem = table[0] as TTableElement;
                size = tableElem.colSizes[cellElement.colIndex!]!;
            }
        } else {
            size = element.offsetHeight;
        }
        setInitialSize(size);

        setIsResizing(true);

        onMouseDown?.(event);
    };

    useEffect(() => {
        if (!isResizing) return;

        const sendResizeEvent = (event: MouseEvent, finished: boolean) => {
            const { clientX, clientY } = event;
            const currentPosition = isHorizontal ? clientX : clientY;
            const delta = currentPosition - initialPosition;
            onResize?.({ initialSize, delta, finished, direction });
        };

        const handleMouseMove = (event: MouseEvent) => {
            sendResizeEvent(event, false);
        };

        const handleMouseUp = (event: MouseEvent) => {
            setIsResizing(false);
            onHoverEnd?.();
            sendResizeEvent(event, true);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        isResizing,
        initialPosition,
        initialSize,
        onResize,
        isHorizontal,
        onHoverEnd,
        direction,
    ]);

    const handleMouseOver = () => {
        onHover?.();
    };

    const handleMouseOut = () => {
        if (!isResizing) {
            onHoverEnd?.();
        }
    };

    const nearSide = direction;
    const start = isHorizontal ? "top" : "left";
    const end = isHorizontal ? "bottom" : "right";
    const size = isHorizontal ? "width" : "height";

    return {
        style: {
            position: "absolute",
            [nearSide]: -width / 2,
            [start]: startMargin,
            [end]: endMargin,
            [size]: width,
            zIndex,
            cursor: isHorizontal ? "col-resize" : "row-resize",
            ...style,
        },
        onMouseDown: handleMouseDown,
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
        ...props,
    };
};

const ResizeHandle = createComponentAs<ResizeHandleProps>((props) => {
    const htmlProps = useResizeHandleProps(props);
    return createElementAs("div", htmlProps);
});

export const TableCellElementResizable = createComponentAs<TableCellElementResizableProps>(
    (props) => {
        const editor = usePlateEditorRef();
        const { disableMarginLeft } = getPluginOptions<TablePlugin>(
            editor,
            ELEMENT_TABLE
        );
        const { readOnly, colIndex } = props;
        const {
            rightProps,
            bottomProps,
            leftProps,
        } = useTableCellElementResizableProps(props);

        const hasLeftHandle = colIndex === 0 && !disableMarginLeft;

        return (
            !readOnly && (
                <>
                    <ResizeHandle { ...rightProps } />
                    <ResizeHandle { ...bottomProps } />
                    { hasLeftHandle && <ResizeHandle { ...leftProps } /> }
                </>
            )
        );
    }
);
