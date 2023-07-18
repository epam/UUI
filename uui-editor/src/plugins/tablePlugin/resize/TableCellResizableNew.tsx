import React from 'react';
import {
  getPluginOptions,
  usePlateEditorRef,
} from '@udecode/plate-common';
import {
  ResizeHandle,
} from '@udecode/resizable';
import { ELEMENT_TABLE, TableCellElementState, TablePlugin, useTableCellElementResizable } from '@udecode/plate-table';

export type TableCellElementResizableProps = Pick<
  TableCellElementState,
  'colIndex' | 'rowIndex' | 'readOnly'
> & {
  /**
   * Resize by step instead of by pixel.
   */
  step?: number;

  /**
   * Overrides for X and Y axes.
   */
  stepX?: number;
  stepY?: number;
};

export function TableCellElementResizable(
  props: TableCellElementResizableProps
) {
  const editor = usePlateEditorRef();
  const { disableMarginLeft } = getPluginOptions<TablePlugin>(
    editor,
    ELEMENT_TABLE
  );
  const { readOnly, colIndex } = props;
  const { rightProps, bottomProps, leftProps } =
    useTableCellElementResizable(props);

  const hasLeftHandle = colIndex === 0 && !disableMarginLeft;

  return readOnly ? null : (
    <>
      <ResizeHandle {...rightProps} />
      <ResizeHandle {...bottomProps} />
      {hasLeftHandle && <ResizeHandle {...leftProps} />}
    </>
  );
}
