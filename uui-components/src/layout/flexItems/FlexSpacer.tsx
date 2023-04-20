import * as React from 'react';
import css from './FlexSpacer.scss';
import { IAdaptiveItem } from '@epam/uui-core';

export interface FlexSpacerProps extends IAdaptiveItem {}

export function FlexSpacer(props: FlexSpacerProps) {
    return <div className={ css.flexSpacer } />;
}

FlexSpacer.displayName = 'FlexSpacer';
