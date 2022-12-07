import { withMods } from '@epam/uui-core';
import { Accordion as uuiAccordion, AccordionProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import '../../assets/styles/variables/layout/accordion.scss';
import css from './Accordion.scss';

export interface AccordionMods {
    mode?: 'block' | 'inline';
    padding?: '0' | '6' | '12' | '18';
}

function applyAccordionMods(mods: AccordionMods & AccordionProps) {
    return [
        'accordion-vars',
        css.root,
        css['mode-' + (mods.mode || 'block')],
        mods.padding && css['padding-' + mods.padding],
    ];
}

export const Accordion = withMods<AccordionProps, AccordionMods>(uuiAccordion, applyAccordionMods, (mods: AccordionMods & AccordionProps) => ({
    dropdownIcon: mods.dropdownIcon !== null && systemIcons[mods.mode === 'block' ? '60' : '30'].foldingArrow,
}));
