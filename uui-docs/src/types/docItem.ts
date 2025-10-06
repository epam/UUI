import React from 'react';
import { CX } from '@epam/uui-core';
import { ThemeId } from './themes';

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
    parentId?: string;
    order?: number;
    tags?: string[];
    markIsNew?: boolean;
}
