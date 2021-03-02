export const mouseCoords = {
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

if (typeof window !== 'undefined' && window.name !== 'nodejs') {
    document.addEventListener('mousemove', (e) => {
        mouseCoords.mouseDx = e.pageX - mouseCoords.mousePageX;
        mouseCoords.mouseDy = e.pageY - mouseCoords.mousePageY;
        mouseCoords.mouseDxSmooth = mouseCoords.mouseDxSmooth * 0.8 + mouseCoords.mouseDx * 0.2;
        mouseCoords.mouseDySmooth = mouseCoords.mouseDySmooth * 0.8 + mouseCoords.mouseDy * 0.2;
        mouseCoords.mousePageX = e.pageX;
        mouseCoords.mousePageY = e.pageY;
        if (mouseCoords.buttons == 0 && e.buttons > 0) {
            mouseCoords.mouseDownPageX = mouseCoords.mousePageX;
            mouseCoords.mouseDownPageY = mouseCoords.mousePageY;
        }
        mouseCoords.buttons = e.buttons;
        //console.log({ mouseDx, mouseDy, mouseDxSmooth, mouseDySmooth });
    });
}