import * as React from 'react';
import css from './FlexSpacer.module.scss';
import { IAdaptiveItem } from '@epam/uui-core';

export interface FlexSpacerProps extends IAdaptiveItem {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FlexSpacer(props: FlexSpacerProps) {
    return <div className={ css.flexSpacer } />;
}
