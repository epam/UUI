import React from "react";
import { IHasCX, cx } from "@epam/uui";
import styles from "./TextOverflow.scss";
import { Tooltip } from '..';

type getTextWidth = (
    text: string,
    font: string,
    canvas: HTMLCanvasElement,
) => number | null;

export const getTextWidth: getTextWidth = (text, font, canvas) => {
    let context = canvas.getContext("2d");

    if (!context) {
        return null;
    }

    context.font = font;

    let metrics = context.measureText(text);

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
            let canvas = document.createElement("canvas");
            let textWidth = getTextWidth(
                this.textContainer.innerText,
                `${this.props.fontSize}px`,
                canvas,
            );
            let containerWidth = this.textContainer.clientWidth;

            if (textWidth) {
                let isTextLonger = textWidth > containerWidth;
                content = isTextLonger ? this.props.text : '';
            }
        }

        return <Tooltip
            content={ content }
            placement="top-start"
            color="white"
        >
            <div className={ cx(styles.container, this.props.cx) }>
                <div ref={ (el) => this.textContainer = el } className={ styles.textContainer }>
                    { this.props.text }
                </div>
            </div>
        </Tooltip>;
    }
}
