import css from './FlexRow.module.scss';
import { FlexCellProps } from '@epam/uui-core';
import { FlexCell as uuiFlexCell } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export type FlexCellMods = {};

export const FlexCell = withMods<FlexCellProps, FlexCellMods>(uuiFlexCell, () => [css.flexCell]);
