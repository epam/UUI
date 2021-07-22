import React, { ReactNode, useRef } from 'react';

export interface ScrollSpyApi {
    scrollToElement: (item?: string) => void;
}
interface ScrollSpyProps {
    items?: string[];
    children: (api: ScrollSpyApi) => ReactNode;
}

export const ScrollSpy = ({ children, items }: ScrollSpyProps) => {
    const spyRef = useRef(null);

    function scrollToElement(item?: string) {
        let element: HTMLDivElement;
        if (!items || items.length === 0 || !Array.isArray(items) || !item) {
            element = spyRef.current.querySelector('.uui-invalid').closest('.uui-label-top');
        } else {
            const selectedId = items.find(i => i === item);
            if (selectedId) {
                element = spyRef.current.querySelector(`#{selectedId}`);
            }
        };

        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    return (
        <div ref={spyRef}>
            {children({ scrollToElement })}
        </div>
    )
}