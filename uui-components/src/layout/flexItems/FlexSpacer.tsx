import * as React from 'react';
import * as css from './FlexSpacer.scss';
import { IAdaptiveItem } from '@epam/uui';

export interface FlexSpacerProps extends IAdaptiveItem {}

export const FlexSpacer = (props: FlexSpacerProps) => <div { ...props } className={ css.flexSpacer } />;