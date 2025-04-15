import * as React from 'react';
import { CX } from '../types';
import { withMods } from './withMods';

export function createSkinComponent<SourceProps, SkinProps = {}>(
    Component: React.ComponentType<SourceProps>,
    getProps?: (props: Readonly<SkinProps>) => Partial<SkinProps | SourceProps>,
    getCx?: (props: Readonly<SkinProps>) => CX,
) : (props: SkinProps & React.RefAttributes<any>) => React.ReactElement<any> | null {
    return withMods(Component as any, getCx as any, getProps as any) as any;
}
