import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { settings } from '../../index';

import css from './Accordion.module.scss';

interface AccordionMods {
    /**
     * Defines component displaying mode.
     * @default 'block'
     */
    mode?: 'block' | 'inline';
    /*
    * Defines component horizontal padding.
    */
    padding?: '0' | '6' | '12' | '18';
}

export interface AccordionModsOverride {}

/** Represents the properties of the Accordion component. */
export type AccordionProps = Overwrite<AccordionMods, AccordionModsOverride> & uuiComponents.AccordionProps;

function applyAccordionMods(mods: AccordionProps) {
    return [
        css.root,
        css[`mode-${mods.mode || 'block'}`],
        mods.padding && css['padding-' + mods.padding],
    ];
}

export const Accordion = withMods<uuiComponents.AccordionProps, AccordionProps>(uuiComponents.Accordion, applyAccordionMods, (mods) => ({
    dropdownIcon: mods.dropdownIcon !== null && settings.accordion.icons.dropdownIcon,
}));
