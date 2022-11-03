import { Icon } from '@epam/uui-core';

import { ReactComponent as BtnCross12 } from './btn-cross-12.svg';
import { ReactComponent as BtnCross18 } from './btn-cross-18.svg';
import { ReactComponent as BtnCross24 } from './btn-cross-24.svg';
import { ReactComponent as FoldingArrow12 } from './folding-arrow-12.svg';
import { ReactComponent as FoldingArrow18 } from './folding-arrow-18.svg';
import { ReactComponent as FoldingArrow24 } from './folding-arrow-24.svg';
import { ReactComponent as Accept12 } from './accept-12.svg';
import { ReactComponent as Accept18 } from './accept-18.svg';
import { ReactComponent as Accept24 } from './accept-24.svg';
import { ReactComponent as Search12 } from './search-12.svg';
import { ReactComponent as Search18 } from './search-18.svg';
import { ReactComponent as Search24 } from './search-24.svg';
import { ReactComponent as Calendar12 } from './calendar-12.svg';
import { ReactComponent as Calendar18 } from './calendar-18.svg';
import { ReactComponent as Calendar24 } from './calendar-24.svg';
import { ReactComponent as Info12 } from './info-12.svg';
import { ReactComponent as Info18 } from './info-18.svg';
import { ReactComponent as Info24 } from './info-24.svg';
import { ReactComponent as Help10 } from './help-fill-10.svg';
import { ReactComponent as Help16 } from './help-fill-16.svg';
import { ReactComponent as check18 } from './check-18.svg';
import { ReactComponent as partlySelect18 } from './partly-select-18.svg';

export type UUISystemIconName = 'accept' | 'calendar' | 'check' | 'clear' | 'foldingArrow' | 'help' | 'info' | 'partlySelect' | 'search';

export const icons: Record<UUISystemIconName, Record<'default' | string, Icon>> = {
    accept: {
        default: Accept18,
        18: Accept12,
        24: Accept12,
        30: Accept18,
        36: Accept18,
        42: Accept18,
        48: Accept24,
        60: Accept24,
    },
    calendar: {
        default: Calendar18,
        18: Calendar12,
        24: Calendar12,
        30: Calendar18,
        36: Calendar18,
        42: Calendar18,
        48: Calendar24,
        60: Calendar24,
    },
    check: {
        default: check18,
    },
    clear: {
        default: BtnCross18,
        18: BtnCross12,
        24: BtnCross12,
        30: BtnCross18,
        36: BtnCross18,
        42: BtnCross18,
        48: BtnCross24,
        60: BtnCross24,
    },
    foldingArrow: {
        default: FoldingArrow18,
        18: FoldingArrow12,
        24: FoldingArrow12,
        30: FoldingArrow18,
        36: FoldingArrow18,
        42: FoldingArrow18,
        48: FoldingArrow24,
        60: FoldingArrow24,
    },
    help: {
        default: Help16,
        18: Help10,
        24: Help10,
        30: Help10,
        36: Help16,
        42: Help16,
        48: Help16,
        60: Help16,
    },
    info: {
        default: Info12,
        18: Info12,
        24: Info12,
        30: Info18,
        36: Info18,
        42: Info18,
        48: Info24,
        60: Info24,
    },
    partlySelect: {
        default: partlySelect18,
    },
    search: {
        default: Search12,
        18: Search12,
        24: Search12,
        30: Search18,
        36: Search18,
        42: Search18,
        48: Search24,
        60: Search24,
    },
};

export const getIcon = (name: UUISystemIconName, size?: string) => {
    const sizes = icons[name];
    return sizes[size] ? sizes[size] : sizes.default;
};