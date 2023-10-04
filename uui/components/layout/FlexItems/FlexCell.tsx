import css from './FlexRow.module.scss';
import * as uuiCore from '@epam/uui-core';
import { FlexCell as uuiFlexCell } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export type FlexCellMods = {};
export type FlexCellProps = uuiCore.FlexCellProps & FlexCellMods;

export const FlexCell = withMods<uuiCore.FlexCellProps, FlexCellMods>(uuiFlexCell, () => [css.flexCell]);
