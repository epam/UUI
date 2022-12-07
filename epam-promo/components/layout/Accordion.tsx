import { withMods } from '@epam/uui-core';
import { Accordion as uuiAccordion, AccordionProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import styles from '../../assets/styles/colorvars/layout/accordion-colorvars.scss';
import css from './Accordion.scss';

export interface AccordionMods {
    /** 'block' mode: render as separate panel (with padding, borders, shadows). 'inline' mode - renders no outside panel, suitable for placing in a panel with other components  */
    mode?: 'block' | 'inline';
    /** Padding inside the panel */
    padding?: '0' | '6' | '12' | '18';
}

function applyAccordionMods(mods: AccordionMods & AccordionProps) {
    return [
        css.root,
        styles.accordionColors,
        css['mode-' + (mods.mode || 'block')],
        mods.padding && css['padding-' + mods.padding],
    ];
}

export const Accordion = withMods<AccordionProps, AccordionMods>(uuiAccordion, applyAccordionMods, (mods: AccordionMods & AccordionProps) => ({
    dropdownIcon: mods.dropdownIcon !== null && systemIcons[mods.mode === 'block' ? '60' : '30'].foldingArrow,
}));
