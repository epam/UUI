import { withMods } from '@epam/uui';
import { Accordion as uuiAccordion, AccordionProps } from '@epam/uui-components';
import { systemIcons } from '../icons/icons';
import * as css from './Accordion.scss';

export interface AccordionMods {
    mode?: 'block' | 'inline';
}

function applyAccordionMods(mods: AccordionMods & AccordionProps) {
    return [
        css.root,
        css['mode-' + (mods.mode || 'block')]
    ];
}

export const Accordion = withMods<AccordionProps, AccordionMods>(uuiAccordion, applyAccordionMods, (mods: AccordionMods & AccordionProps) => ({
    dropdownIcon: systemIcons[mods.mode === 'block' ? '60' : '36'].foldingArrow,
}));
