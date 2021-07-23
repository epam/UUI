import React, { MutableRefObject, ReactNode, RefObject, useEffect, useRef, useState } from 'react';

export interface ScrollSpyApi {
    scrollToElement: (item?: string) => void;
    currentActive?: string;
    ref?: RefObject<HTMLElement>;
}
interface ScrollSpyProps {
    root?: RefObject<Element>;
    offset?: {
        top: number;
        bottom: number;
        right: number;
        left: number;
    }; // rootMargin for observation
    elements?: Readonly<string[]>;
    children?: (api: ScrollSpyApi) => ReactNode;
}

function scrollToElement(root: ScrollSpyProps['root'], elements?: ScrollSpyProps['elements']): (item?: string) => void {
    return item => {
        let element;

        if (!elements || elements.length === 0 || !Array.isArray(elements) || !item) {
            element = root.current.querySelector('.uui-invalid').closest('.uui-label-top');
        } else if (item && elements.includes(item)) {
            const selectedId = elements.find(i => i === item);
            if (selectedId) {
                element = root.current.querySelector(`#{selectedId}`);
            }
        };

        element && element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
};

export function useScrollSpy({
    root,
    elements = [],
    offset = { top: 0, bottom: 0, left: 0, right: 0 }
}: Omit<ScrollSpyProps, 'children'>): ScrollSpyApi {
    const [currentActive, setCurrentActive] = useState<string>();
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);

    const observer: MutableRefObject<IntersectionObserver> = useRef(null);
    const rootMargin: string = `${offset.top}px ${offset.right}px ${offset.bottom}px ${offset.left}px`;

    useEffect(() => {
        if (root.current && elements.length > 0) {
            setObservedNodes(elements.map(element => {
                return root.current.querySelector(`[id='${element}'], [data-spy='${element}'], [name='${element}']`)
            }));
        }
    }, [root]);

    useEffect(() => {
        if (observedNodes.length === 0 || !root.current) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            console.log({ entries, observer })
            const intersectingElementIndex = entries.findIndex(entry => entry.intersectionRatio > 0);
            const intersectingElement = elements.find((_, index) => index === intersectingElementIndex);
            setCurrentActive(intersectingElement);
        }, { root: root.current, rootMargin });

        observedNodes.forEach(element => element ? observer.current.observe(element) : null);

        return () => observer.current.disconnect();
    }, [observedNodes, root]);

    return {
        scrollToElement: scrollToElement(root, elements),
        currentActive,
    };
};

export const ScrollSpy = ({ children, elements }: ScrollSpyProps) => {
    const spyRef = useRef(null);

    return (
        <div ref={spyRef}>
            {children({ scrollToElement: scrollToElement(spyRef, elements), ref: spyRef })}
        </div>
    )
}