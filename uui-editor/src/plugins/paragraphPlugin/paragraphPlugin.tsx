import * as React from 'react';
import { Editor as CoreEditor } from "slate";
import { RenderBlockProps } from "slate-react";
import { getBlockDesirialiser } from '../../helpers';

export const paragraphPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'paragraph':
                return <p { ...props.attributes }>{ props.children }</p>;
            default:
                return next();
        }
    };

    return {
        renderBlock,
        serializers: [paragraphDesializer],
    };
};

const PARAGRAPH_TAG: any = {
    p: 'paragraph',
};

const paragraphDesializer = getBlockDesirialiser(PARAGRAPH_TAG);