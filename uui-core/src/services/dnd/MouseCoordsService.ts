import { isClientSide } from '../../helpers/ssr';

export type TMouseCoords = {
    mousePageX: number,
    mousePageY: number,
    mouseDx: number,
    mouseDy: number,
    mouseDxSmooth: number,
    mouseDySmooth: number,
    mouseDownPageX: number,
    mouseDownPageY: number,
    buttons: number,
};

export class MouseCoordsService {
    private _prevMouseCoords: TMouseCoords;

    init = () => {
        this._prevMouseCoords = {
            mousePageX: 0,
            mousePageY: 0,
            mouseDx: 0,
            mouseDy: 0,
            mouseDxSmooth: 0,
            mouseDySmooth: 0,
            mouseDownPageX: 0,
            mouseDownPageY: 0,
            buttons: 0,
        };
        if (isClientSide) {
            document.addEventListener('pointermove', this.handleMouseCoordsChange);
        }
    };

    public destroy() {
        if (isClientSide) {
            document.removeEventListener('pointermove', this.handleMouseCoordsChange);
        }
    }

    private handleMouseCoordsChange = (e: PointerEvent) => {
        this._prevMouseCoords = getMouseCoordsFromPointerEvent(e, this._prevMouseCoords);
    };

    public getCoords = () => {
        return this._prevMouseCoords;
    };
}

function getMouseCoordsFromPointerEvent(e: PointerEvent, prevCoords: TMouseCoords): TMouseCoords {
    const mouseDx = e.pageX - prevCoords.mousePageX;
    const mouseDy = e.pageY - prevCoords.mousePageY;
    const mouseDxSmooth = prevCoords.mouseDxSmooth * 0.8 + mouseDx * 0.2;
    const mouseDySmooth = prevCoords.mouseDySmooth * 0.8 + mouseDy * 0.2;
    const mousePageX = e.pageX;
    const mousePageY = e.pageY;
    const result: TMouseCoords = {
        mouseDx,
        mouseDy,
        mouseDxSmooth,
        mouseDySmooth,
        mousePageX,
        mousePageY,
        buttons: e.buttons,
        mouseDownPageX: prevCoords.mouseDownPageX || 0,
        mouseDownPageY: prevCoords.mouseDownPageY || 0,
    };
    if ((prevCoords.buttons === 0 && e.buttons > 0) || e.pointerType === 'touch') {
        result.mouseDownPageX = mousePageX;
        result.mouseDownPageY = mousePageY;
    }
    return result;
}
