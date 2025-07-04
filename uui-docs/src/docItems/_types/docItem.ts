import React from 'react';
import { CX } from '@epam/uui-core';
import { ThemeId } from './themes';
import { TDocConfig } from '../../docBuilderGen/docBuilderGenTypes';

export interface DocItem {
    id: string;
    name: string;
    component?: any;
    examples?: {
        name?: string;
        componentPath?: any;
        descriptionPath?: string;
        onlyCode?: boolean; // if true, then the example will be rendered without description
        cx?: CX;
        themes?: ThemeId[];
    }[];
    renderContent?: () => React.ReactNode;
    explorerConfig?: TDocConfig;
    parentId?: string;
    order?: number;
    tags?: string[];
}
