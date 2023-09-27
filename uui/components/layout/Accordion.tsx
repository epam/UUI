import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import css from './Accordion.module.scss';

export interface AccordionMods {
    mode?: 'block' | 'inline';
    padding?: '0' | '6' | '12' | '18';
}

export type AccordionProps = AccordionMods & uuiComponents.AccordionProps;

function applyAccordionMods(mods: AccordionProps) {
    return [
        css.root, css['mode-' + (mods.mode || 'block')], mods.padding && css['padding-' + mods.padding],
    ];
}

export const Accordion = withMods<uuiComponents.AccordionProps, AccordionMods>(uuiComponents.Accordion, applyAccordionMods, (mods) => ({
    dropdownIcon: mods.dropdownIcon !== null && systemIcons[mods.mode === 'block' ? '60' : '30'].foldingArrow,
}));
