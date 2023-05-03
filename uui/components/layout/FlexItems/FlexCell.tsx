import * as React from 'react';
import css from './FlexRow.scss';
import { FlexCellProps } from '@epam/uui-core';
import { FlexCell as uuiFlexCell } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export type FlexCellMods = {};

export const FlexCell = withMods<FlexCellProps, FlexCellMods>(uuiFlexCell, (props) => [css.flexCell]);
