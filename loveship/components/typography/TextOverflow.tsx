import React from 'react';
import { IHasCX, cx } from '@epam/uui-core';
import styles from './TextOverflow.module.scss';
import { Tooltip } from '../overlays';

export const getTextWidth = (text: string, font: string, canvas: HTMLCanvasElement): number | null => {
    const context = canvas.getContext('2d');

    if (!context) {
        return null;
    }

    context.font = font;

    const metrics = context.measureText(text);

    return metrics.width;
};

interface TextOverflowProps extends IHasCX {
    text: string;
    fontSize: number; // px
}

export class TextOverflow extends React.Component<TextOverflowProps> {
    textContainer: HTMLElement | null = null;
    render() {
        let content = '';
        if (this.textContainer) {
            const canvas = document.createElement('canvas');
            const textWidth = getTextWidth(this.textContainer.innerText, `${this.props.fontSize}px`, canvas);
            const containerWidth = this.textContainer.clientWidth;

            if (textWidth) {
                const isTextLonger = textWidth > containerWidth;
                content = isTextLonger ? this.props.text : '';
            }
        }

        return (
            <Tooltip content={ content } placement="top-start" color="white">
                <div className={ cx(styles.container, this.props.cx) }>
                    <div
                        ref={ (el) => {
                            (this.textContainer = el);
                        } }
                        className={ styles.textContainer }
                    >
                        {this.props.text}
                    </div>
                </div>
            </Tooltip>
        );
    }
}
