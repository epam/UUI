import * as css from './FlexRow.scss';
import { FlexCellProps } from '@epam/uui';
import { FlexCell as uuiFlexCell } from '@epam/uui-components';
import { withMods } from '@epam/uui';

export type FlexCellMods = {};

export const FlexCell = withMods<FlexCellProps, FlexCellMods>(uuiFlexCell, props => [
    css.flexCell,
]);