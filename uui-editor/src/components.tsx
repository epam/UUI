import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_SUPERSCRIPT, MARK_UNDERLINE } from '@udecode/plate-basic-marks';
import { PlatePluginComponent, withProps } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { StyledElement, StyledLeaf } from '@udecode/plate-styled-components';
import { css } from 'styled-components';

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
    >
) => {
    const components = {
        [ELEMENT_H1]: withProps(StyledElement, {
            as: 'h1',
            styles: {
                root: css`
                    margin: 2em 0 4px;
                    font-size: 1.875em;
                    font-weight: 500;
                    line-height: 1.3;
                `,
            },
        }),
        [ELEMENT_H2]: withProps(StyledElement, {
            as: 'h2',
            styles: {
                root: css`
                    margin: 1.4em 0 1px;
                    font-size: 1.5em;
                    font-weight: 500;
                    line-height: 1.3;
                `,
            },
        }),
        [ELEMENT_H3]: withProps(StyledElement, {
            as: 'h3',
            styles: {
                root: css`
                    margin: 1em 0 1px;
                    font-size: 1.25em;
                    font-weight: 500;
                    line-height: 1.3;
                    color: #434343;
                `,
            },
        }),
        [ELEMENT_H4]: withProps(StyledElement, {
            as: 'h4',
            styles: {
                root: css`
                    margin: 0.75em 0 0;
                    font-size: 1.1em;
                    font-weight: 500;
                    line-height: 1.3;
                    color: #666666;
                `,
            },
        }),
        [ELEMENT_H5]: withProps(StyledElement, {
            as: 'h5',
            styles: {
                root: css`
                    margin: 0.75em 0 0;
                    font-size: 1.1em;
                    font-weight: 500;
                    line-height: 1.3;
                    color: #666666;
                `,
            },
        }),
        [ELEMENT_H6]: withProps(StyledElement, {
            as: 'h6',
            styles: {
                root: css`
                    margin: 0.75em 0 0;
                    font-size: 1.1em;
                    font-weight: 500;
                    line-height: 1.3;
                    color: #666666;
                `,
            },
        }),
        [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
            as: 'p',
            styles: {
                root: css`
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                    padding-left: 0;
                    padding-right: 0;
                    margin: 0;
                `
            },
            prefixClassNames: 'p',
        }),
        [MARK_BOLD]: withProps(StyledLeaf, { as: 'strong' }),
        [MARK_CODE]: withProps(StyledLeaf, {
            as: 'code',
            styles: {
                root: [
                    css`
                        font-size: 85%;
                        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo,
                          Courier, monospace;
                        background-color: rgba(135, 131, 120, 0.15);
                        border-radius: 3px;
                        padding: 0.2em 0.4em;
                        line-height: normal;
                        white-space: pre-wrap;
                    `,
                ],
            },
        }),
        [MARK_ITALIC]: withProps(StyledLeaf, { as: 'em' }),
        [MARK_SUPERSCRIPT]: withProps(StyledLeaf, { as: 'sup' }),
        [MARK_UNDERLINE]: withProps(StyledLeaf, { as: 'u' }),
    };

    if (overrideByKey) {
        Object.keys(overrideByKey).forEach((k) => {
            const key = k as DefaultPluginKey;
            components[key] = overrideByKey[key];
        });
    }

    return components;
};
