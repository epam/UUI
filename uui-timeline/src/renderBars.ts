import { getOrderComparer } from '@epam/uui-core';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';

export interface Item {
    from: Date;
    to: Date;
    color: string;
    fillType?: 'shaded' | 'solid';
    opacity?: number;
    height?: number;
    priority?: number;
    minPixPerDay?: number;
    maxPxPerDay?: number;
    // y: number;
    // name: string;
}

export function renderBars(items: Item[], canvasHeight: number, ctx: CanvasRenderingContext2D, t: TimelineTransform): void {
    const pxPerDay = t.pxPerMs * msPerDay;
    const pattern = ctx.createPattern(getHatchingPattern(), 'repeat');

    const comparer = getOrderComparer([{ field: 'priority', direction: 'asc' }]);
    [...items].sort(comparer)
        .filter((i) => (!i.minPixPerDay || pxPerDay > i.minPixPerDay) && (!i.maxPxPerDay || pxPerDay < i.maxPxPerDay))
        .forEach((i) => {
            const leftTopCornerX = t.getX(i.from);
            const leftTopCornerY = Math.round((canvasHeight - i.height) / 2);
            const rectHeight = i.height ? i.height : 18;
            const rectWidth = t.getX(i.to) - t.getX(i.from);

            ctx.beginPath();
            ctx.rect(leftTopCornerX, leftTopCornerY, rectWidth, rectHeight);
            ctx.fillStyle = i.fillType === 'shaded' ? pattern : i.color;
            ctx.globalAlpha = i.opacity ? i.opacity : 1;
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        });
}

function getHatchingPattern() {
    const canvasPattern = document.createElement('canvas');
    canvasPattern.width = 18;
    canvasPattern.height = 18;
    const ctx = canvasPattern.getContext('2d');

    ctx.fillStyle = '#D9DBE3';
    ctx.strokeStyle = '#A8A9B4';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.fillRect(0, 0, 18, 18);
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(18, 12);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(18, 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(12, 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(6, 18);
    ctx.stroke();

    return canvasPattern;
}
