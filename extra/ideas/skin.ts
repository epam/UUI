import { IClickable, Icon } from '@epam/uui';
import * as React from 'react';

type UUIInterfaces = {
    'Icon': Icon;
    'IClickable': IClickable;
};

export type UUIInterfaceName = keyof UUIInterfaces;

export type StandardIconType = 'dropdown' | 'btn-ok' | 'btn-delete';

export interface SkinContext {
    getComponent<T extends UUIInterfaceName>(type: T): React.ComponentClass<UUIInterfaces[T]>;  
    getIcon(type: StandardIconType): Icon;
}

/* test code, remove later */
const skin: SkinContext = null;
const Btn = skin.getComponent('IClickable');

