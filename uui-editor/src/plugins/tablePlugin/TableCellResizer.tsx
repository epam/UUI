import { findNode, findNodePath, toDOMNode, toDOMPoint, toSlateNode, toSlatePoint, useElement, usePlateEditorRef, usePlateEditorState } from '@udecode/plate-common';
import { TTableCellElement, getCellTypes, roundCellSizeToStep, setTableColSize, useOverrideColSize, useTableElement, useTableElementState, useTableStore } from '@udecode/plate-table';
import { ResizeDirection, ResizeEvent, ResizeHandle, resizeLengthClampStatic } from '@udecode/resizable';
import React, { MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

interface TableCellResizerProps {
    tableRef: MutableRefObject<HTMLTableElement>;
    colSizes: number[];
}

export function getCellFromTarget(node: Node): Node | null {
    let currentNode: ParentNode | Node | null = node;

    while (currentNode != null) {
        const nodeName = currentNode.nodeName;

        if (nodeName === 'TD' || nodeName === 'TH') {
            return currentNode;
        }

        currentNode = currentNode.parentNode;
    }

    return null;
}

export function TableCellResizer({ tableRef, colSizes }: TableCellResizerProps): ReactElement {
    const editor = usePlateEditorState();
    const [activeCell, setActiveCell] = useState<HTMLElement | undefined>(undefined);
    const resizerRef = useRef<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const tableRectRef = useRef<ClientRect | null>(null);

    // targetRef.current = target as HTMLElement;
    // tableRectRef.current = tableElement.getBoundingClientRect();

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (event.target instanceof Node) {
                const target = event.target;

                // const slateNode = toSlateNode(editor, event.target);

                const cellNodePath = toSlatePoint(editor, [event.target, 0], { exactMatch: false, suppressThrow: false });

                const cellEntry = findNode<TTableCellElement>(editor, {
                    match: { type: getCellTypes(editor) },
                    at: cellNodePath,
                });

                if (resizerRef.current && resizerRef.current.contains(target as Node)) {
                    console.log('return existing');
                    return;
                }

                if (cellEntry) {
                    const cellNode = getCellFromTarget(event.target);

                    if (cellEntry && cellNode !== activeCell) {
                        const domPoint = toDOMPoint(editor, cellNodePath);

                        // console.log('target', target, 'domPoint', domPoint);

                        setActiveCell(cellNode as HTMLElement);
                    } else {
                        console.log('mouseover the same cell');
                    }
                }
            }
        };

        // TODO: make listener attached to table only
        tableRef.current?.addEventListener('mousemove', onMouseMove);

        return () => {
            tableRef.current?.removeEventListener('mousemove', onMouseMove);
        };
    }, [editor]);

    const getResizers = useCallback(() => {
        const rect = activeCell?.getBoundingClientRect();
        if (rect) {
            const { height, left, top, width } = rect;
            console.log('window.pageXOffset', window.pageXOffset, 'window.pageYOffset', window.pageYOffset);
            const rightStyles = {
                // height: `${height}px`,
                left: `${left - 4}px`,
                // left: 0,
                // top: `${top}px`,
            };
            console.log('rect', rect, rightStyles);

            return rightStyles;
        } else {
            return {};
        }
    }, [activeCell]);

    const { isSelectingCell, minColumnWidth, marginLeft } = useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    const element = useElement();
    // const editor = props.editor;
    const [showResizer, setShowResizer] = useState<boolean>(false);

    const getHandleHoverProps = () => {
        const colIndex = 0;
        return ({
            onHover: () => {
                if (!showResizer) {
                // console.log('set hovered col index', colIndex);
                    setShowResizer(true);
                }
            },
            onHoverEnd: () => {
                if (showResizer) {
                // console.log('set hovered col index end', colIndex);
                    setShowResizer(false);
                }
            },
        });
    };

    const overrideColSize = useOverrideColSize();

    const setColSize = useCallback(
        (colIndex: number, width: number) => {
            setTableColSize(
                editor,
                { colIndex, width },
                { at: findNodePath(editor, element)! },
            );

            // Prevent flickering
            setTimeout(() => overrideColSize(colIndex, null), 0);
        },
        [editor, overrideColSize, element],
    );

    const handleResizeRight = useCallback(
        (
            { initialSize: currentInitial, delta, finished }: ResizeEvent,
            colIndex: number,
        ) => {
            const nextInitial = colSizes[colIndex + 1];

            const complement = (width: number) =>
                currentInitial + nextInitial - width;

            // console.log(
            //   'currentInitial',
            //   currentInitial,
            //   'nextInitial',
            //   nextInitial,
            //   'minColumnWidth',
            //   minColumnWidth
            // );

            const currentNew = roundCellSizeToStep(
                resizeLengthClampStatic(currentInitial + delta, {
                    min: minColumnWidth,
                    max: nextInitial ? complement(minColumnWidth) : undefined,
                }),
            // stepX
            );
            // console.log('calc', currentInitial, nextInitial, currentNew);
            const nextNew = nextInitial ? complement(currentNew) : undefined;
            // console.log('currentNew', currentNew, 'nextNew', nextNew);
            const fn = finished ? setColSize : overrideColSize;
            fn(colIndex, currentNew);

            // if (nextNew) fn(colIndex + 1, nextNew);
        },
        [colSizes, minColumnWidth, overrideColSize, setColSize],
    );

    // getResizers();

    const { realColSizes, width } = colSizes.reduce(
        (acc, cur) => {
            if (Number.isInteger(cur)) {
                acc.width += cur;
                acc.realColSizes.push(cur);
            }
            return acc;
        },
        { width: 0, realColSizes: [] },
    );

    return (
        <div ref={ resizerRef } style={ { width, display: 'flex' } }>
            <div style={ { width: width, height: 5 } }>
                <div
                    className="group absolute top-0 h-full select-none"
                    style={ { width: width } }
                    contentEditable={ false }
                    suppressContentEditableWarning={ true }
                >
                    <ResizeHandle
                        style={ {
                            position: 'absolute',
                            zIndex: 30000000,
                            height: '100%',
                            width: '0.25rem',
                            right: '-1.5px',
                            backgroundColor: 'hsl(240 5% 64.9%)',
                            // backgroundColor: 'hsl(240 5% 64.9%)',
                            ...getResizers(),
                        } }
                        // className={ cn(
                        //     'absolute z-30 h-ful w-1',
                        //     'right-[-1.5px]',
                        //     hoveredColIndex === index && 'bg-ring',
                        // ) }
                        options={ {
                            direction: 'right' as ResizeDirection,
                            onResize: (resizeEvent) => {
                                const index = 0;
                                handleResizeRight(resizeEvent, index);
                            },
                            ...getHandleHoverProps(),
                        } }
                    />
                </div>
            </div>
        </div>
    );
}
