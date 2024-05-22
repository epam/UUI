import css from './FlexRow.module.scss';
import * as uuiCore from '@epam/uui-core';
import { FlexCell as uuiFlexCell } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

type FlexCellMods = {};

/** Represents the properties of the FlexCell component. */
export type FlexCellProps = uuiCore.FlexCellProps & FlexCellMods;

export const FlexCell = withMods<uuiCore.FlexCellProps, FlexCellProps>(uuiFlexCell, () => [css.flexCell]);
