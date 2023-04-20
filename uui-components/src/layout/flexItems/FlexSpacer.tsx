import * as React from 'react';
import css from './FlexSpacer.scss';
import { IAdaptiveItem } from '@epam/uui-core';

export interface FlexSpacerProps extends IAdaptiveItem {}

export const FlexSpacer = (props: FlexSpacerProps) => <div className={css.flexSpacer} />;

FlexSpacer.displayName = 'FlexSpacer';
