import React from 'react';
import { PlaceholderProps, createNodesHOC } from '@udecode/plate-common';
import { ELEMENT_H1 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';

const Placeholder = (props: PlaceholderProps) => {
    const { children, placeholder, nodeProps } = props;

    return React.Children.map(children, (child) => {
        return React.cloneElement(child, {
            className: child.props.className,
            nodeProps: {
                ...nodeProps,
                placeholder,
            },
        });
    });
};

const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

export const withPlaceholders = (components: any) =>
    withPlaceholdersPrimitive(components, [
        {
            key: ELEMENT_PARAGRAPH,
            placeholder: 'Type a paragraph',
            hideOnBlur: true,
            query: {
                maxLevel: 1,
            },
        },
        {
            key: ELEMENT_H1,
            placeholder: 'Untitled',
            hideOnBlur: false,
        },
    ]);
