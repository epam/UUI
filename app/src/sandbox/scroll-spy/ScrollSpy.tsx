import { MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface IScrollSpyApi {
    scrollToElement: (item?: string, selector?: string) => void;
    currentActive?: string;
    ref: HTMLElement;
    setRef: (ref: HTMLElement) => void;
}
interface IScrollSpyProps {
    root?: HTMLElement;
    elements?: Readonly<string[]>;
    selector?: string;
    initialActive?: string;
    options?: IntersectionObserverInit;
    children?: (api: IScrollSpyApi) => ReactNode;
}

export function useScrollSpy(
    elements?: IScrollSpyProps['elements'],
    initialActive?: string,
    options?: IScrollSpyProps['options']
) : IScrollSpyApi {
    const ref: MutableRefObject<HTMLElement> = useRef();
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);
    const [currentActive, setCurrentActive] = useState<string>(
        initialActive || (Array.isArray(elements) && elements.length > 0 && elements[0])
    );

    const getElement = useCallback((root: IScrollSpyProps['root'], id?: string, selector?: IScrollSpyProps['selector']): HTMLElement => {
        return root.querySelector(selector || `[id='${id}'], [data-spy='${id}'], [name='${id}'], [class='${id}']`)
    }, [ref]);

    const scrollToElement = (item: string, selector: string) => {
        let element;

        if (item && elements && elements.includes(item)) {
            const selected = elements.find(element => element === item);
            if (selected) element = getElement(ref.current, selected);
        } else if (!elements && !item && selector) {
            element = getElement(ref.current, undefined, selector);
        }

        if (element) {
            element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else return;
    };

    useEffect(() => {
        if (!ref || !elements || !Array.isArray(elements) || elements.length === 0) return;
        setObservedNodes(elements.map(element => getElement(ref.current, element)));
    }, [ref]);

    useEffect(() => {
        if (observedNodes.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            const intersectingElement = entries.find(entry => entry.isIntersecting) as any;
            setCurrentActive(intersectingElement?.target?.dataset?.spy);
        }, {
            ...options,
            root: options?.root || document.querySelector('body')
        });

        observedNodes.forEach(element => element ? observer.observe(element) : null);

        return () => observer.disconnect();
    }, [observedNodes]);

    return {
        scrollToElement,
        currentActive,
        setRef: (selectedRef: HTMLElement) => ref.current = selectedRef,
        ref: ref.current,
    };
};

export function ScrollSpy({ elements, children } : IScrollSpyProps): ReactNode {
    const { currentActive, scrollToElement, setRef, ref } = useScrollSpy(elements);
    return children({ scrollToElement, setRef, currentActive, ref });
}