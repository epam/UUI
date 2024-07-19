import { CanvasDrawHorizontalLineProps, CanvasDrawRectangleProps, CanvasDrawVerticalLineProps } from './types';

const defaultColors = {
    defaultLineColor: '#E1E3EB',
    defaultRectangleColor: '#FAFAFC',
};

const drawVerticalLine = ({ context, color = defaultColors.defaultLineColor, x, width = 1, y1 = 0, y2 }: CanvasDrawVerticalLineProps) => {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(x, y1);
    context.lineTo(x, y2);
    context.lineWidth = width;
    context.stroke();
};

const drawHorizontalLine = ({ context, color = defaultColors.defaultLineColor, y, x1 = 0, x2, width = 1 }: CanvasDrawHorizontalLineProps) => {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(x1, y);
    context.lineTo(x2, y);
    context.lineWidth = width;
    context.stroke();
};

const drawRectangle = ({ context, color = defaultColors.defaultRectangleColor, x, y, width, height }: CanvasDrawRectangleProps) => {
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.closePath();
};

export const timelinePrimitives = {
    drawVerticalLine,
    drawHorizontalLine,
    drawRectangle,

    defaultColors,
};
