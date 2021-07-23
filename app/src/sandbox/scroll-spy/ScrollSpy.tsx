import { ReactNode, useCallback, useEffect, useState } from 'react';

export interface IScrollSpyApi {
    scrollToElement: (item?: string) => void;
    currentActive?: string;
    setRef: (ref: HTMLElement) => void;
}
interface IScrollSpyProps {
    root?: HTMLElement;
    elements?: Readonly<string[]>;
    options?: IntersectionObserverInit;
    children?: (api: IScrollSpyApi) => ReactNode;
}

export function useScrollSpy(
    elements?: IScrollSpyProps['elements'],
    options?: IScrollSpyProps['options']
) : IScrollSpyApi {
    const [ref, setRef] = useState<HTMLElement>(null);
    const [currentActive, setCurrentActive] = useState<string>(Array.isArray(elements) && elements.length > 0 && elements[0]);
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);

    const getElement = useCallback((root: IScrollSpyProps['root'], id: string): HTMLElement => {
        return root.querySelector(`[id='${id}'], [data-spy='${id}'], [name='${id}']`)
    }, []);

    const scrollToElement = useCallback(
        (root: IScrollSpyProps['root'], elements?: IScrollSpyProps['elements']): ((item?: string) => void) => {
            return item => {
                let element;

                if (!elements || elements.length === 0 || !Array.isArray(elements) || !item) {
                    element = root.querySelector('.uui-invalid').closest('.uui-label-top');
                } else if (item && elements.includes(item)) {
                    const selected = elements.find(i => i === item);
                    if (selected) element = getElement(root, selected);
                };

                if (element) {
                    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
                } else return;
            };
        }, []
    );

    useEffect(() => {
        if (!ref || !elements || !Array.isArray(elements) || elements.length === 0) return;
        setObservedNodes(elements.map(element => getElement(ref, element));
    }, [ref]);

    useEffect(() => {
        if (observedNodes.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            const intersectingElement = entries.find(entry => entry.isIntersecting) as any;
            setCurrentActive(intersectingElement?.target?.dataset?.spy);
        }, options);

        observedNodes.forEach(element => element ? observer.observe(element) : null);

        return () => observer.disconnect();
    }, [observedNodes]);

    return {
        scrollToElement: scrollToElement(ref, elements),
        currentActive,
        setRef,
    };
};

export function ScrollSpy({ elements, children } : IScrollSpyProps) {
    const { currentActive, scrollToElement,  setRef } = useScrollSpy(elements);
    return children({ scrollToElement, setRef, currentActive });
}