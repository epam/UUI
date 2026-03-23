import React from 'react';
import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_SUPERSCRIPT, MARK_UNDERLINE } from '@udecode/plate-basic-marks';
import { PlateElement, PlateLeaf, PlatePluginComponent } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';

export type DefaultPluginKey =
    | typeof ELEMENT_H1
    | typeof ELEMENT_H2
    | typeof ELEMENT_H3
    | typeof ELEMENT_H4
    | typeof ELEMENT_H5
    | typeof ELEMENT_H6
    | typeof ELEMENT_PARAGRAPH
    | typeof MARK_BOLD
    | typeof MARK_CODE
    | typeof MARK_ITALIC
    | typeof MARK_SUPERSCRIPT
    | typeof MARK_UNDERLINE;

export const createPlateUI = <T extends string = string>(
    overrideByKey?: Partial<
    Record<DefaultPluginKey | T, PlatePluginComponent>
    >,
) => {
    const components: { [key: string]: PlatePluginComponent } = {
        [ELEMENT_H1]: (props) => (
            <PlateElement as="h1" { ...props } />
        ),
        [ELEMENT_H2]: (props) => (
            <PlateElement as="h2" { ...props } />
        ),
        [ELEMENT_H3]: (props) => (
            <PlateElement as="h3" { ...props } />
        ),
        [ELEMENT_H4]: (props) => (
            <PlateElement as="h4" { ...props } />
        ),
        [ELEMENT_H5]: (props) => (
            <PlateElement as="h5" { ...props } />
        ),
        [ELEMENT_H6]: (props) => (
            <PlateElement as="h6" { ...props } />
        ),
        [ELEMENT_PARAGRAPH]: (props) => (
            <PlateElement as="p" { ...props } />
        ),
        [MARK_BOLD]: (props) => (
            <PlateLeaf as="strong" { ...props } />
        ),
        [MARK_CODE]: (props) => (
            <PlateLeaf as="code" { ...props } />
        ),
        [MARK_ITALIC]: (props) => (
            <PlateLeaf as="em" { ...props } />
        ),
        [MARK_SUPERSCRIPT]: (props) => (
            <PlateLeaf as="sup" { ...props } />
        ),
        [MARK_UNDERLINE]: (props) => (
            <PlateLeaf as="u" { ...props } />
        ),
    };

    if (overrideByKey) {
        Object.keys(overrideByKey).forEach((k) => {
            const key = k as DefaultPluginKey;
            components[key] = overrideByKey[key]!; // TODO: improve typing
        });
    }

    return components;
};
