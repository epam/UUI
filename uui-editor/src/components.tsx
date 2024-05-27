import React from 'react';
import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_SUPERSCRIPT, MARK_UNDERLINE } from '@udecode/plate-basic-marks';
import { PlatePluginComponent } from '@udecode/plate-common';
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
        [ELEMENT_H1]: (props) => <h1 { ...props.attributes }>{ props.children }</h1>,
        [ELEMENT_H2]: (props) => <h2 { ...props.attributes }>{ props.children }</h2>,
        [ELEMENT_H3]: (props) => <h3 { ...props.attributes }>{ props.children }</h3>,
        [ELEMENT_H4]: (props) => <h4 { ...props.attributes }>{ props.children }</h4>,
        [ELEMENT_H5]: (props) => <h5 { ...props.attributes }>{ props.children }</h5>,
        [ELEMENT_H6]: (props) => <h6 { ...props.attributes }>{ props.children }</h6>,
        [ELEMENT_PARAGRAPH]: (props) => <p { ...props.attributes }>{ props.children }</p>,
        [MARK_BOLD]: (props) => <strong { ...props.attributes }>{ props.children }</strong>,
        [MARK_CODE]: (props) => <code { ...props.attributes }>{ props.children }</code>,
        [MARK_ITALIC]: (props) => <em { ...props.attributes }>{ props.children }</em>,
        [MARK_SUPERSCRIPT]: (props) => <sup { ...props.attributes }>{ props.children }</sup>,
        [MARK_UNDERLINE]: (props) => <u { ...props.attributes }>{ props.children }</u>,
    };

    if (overrideByKey) {
        Object.keys(overrideByKey).forEach((k) => {
            const key = k as DefaultPluginKey;
            components[key] = overrideByKey[key]!; // TODO: improve typing
        });
    }

    return components;
};
