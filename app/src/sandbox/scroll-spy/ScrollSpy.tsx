import { MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface IScrollSpyApi {
    scrollToElement: (item?: string, selector?: string) => void;
    currentActive: string;
    setRef: (ref: HTMLElement) => void;
}
interface IScrollSpyProps {
    root: HTMLElement;
    elements?: Readonly<string[]>;
    selector?: string;
    initialActive?: string;
    options?: IntersectionObserverInit;
    children?: (api: IScrollSpyApi) => ReactNode;
}

export function useScrollSpy(
    elements?: IScrollSpyProps['elements'],
    initialActive?: IScrollSpyProps['initialActive'],
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

    const scrollToAnchor = useCallback((item: string, elements: IScrollSpyProps['elements']) => {
        const selected = elements.find(element => element === item);
        if (selected) return getElement(ref.current, selected);
    }, [ref]);

    const scrollBySelector = useCallback((selector: IScrollSpyProps['selector']) => {
        if (!selector) return;
        return getElement(ref.current, undefined, selector);
    }, [ref]);

    const scrollToElement = useCallback((item: string, selector: string) => {
        const element = item && elements && elements.includes(item) ?
            scrollToAnchor(item, elements) :
            scrollBySelector(selector);

        if (element) element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, []);

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
    };
};

export function ScrollSpyContainer({ elements, children } : IScrollSpyProps): ReactNode {
    const { currentActive, scrollToElement, setRef } = useScrollSpy(elements);
    return children({ scrollToElement, currentActive, setRef });
}