interface ScrollBarSize {
    height: number;
    width: number;
}

export let scrollBarSize: ScrollBarSize | null = null;

function getScrollBarSize(): ScrollBarSize {
    if (typeof window === 'undefined' || window.name === 'nodejs') {
        return {
            width: 18,
            height: 18,
        };
    }

    let inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "100%";

    let outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.height = "100px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);

    let w1 = inner.offsetWidth;
    let h1 = inner.offsetHeight;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;
    let h2 = inner.offsetHeight;
    if (w1 == w2) w2 = outer.clientWidth;
    if (h1 == h2) h2 = outer.clientHeight;

    document.body.removeChild(outer);

    return {
        width: w1 - w2,
        height: h1 - h2,
    };
}

scrollBarSize = getScrollBarSize();
