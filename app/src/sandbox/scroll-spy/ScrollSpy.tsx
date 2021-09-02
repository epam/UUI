import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { IHasChildren } from '@epam/uui';

export interface IScrollSpyProps {
    elements?: Readonly<string[]>;
    initialActive?: string;
    options?: IntersectionObserverInit;
}

export interface IScrollSpyApi {
    scrollToElement: (item?: string) => void;
    currentActive: string;
    setRef: (ref: HTMLElement) => void;
}

export function useScrollSpy(props?: IScrollSpyProps) : IScrollSpyApi {
    const ref: MutableRefObject<HTMLElement> = useRef();
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);
    const [currentActive, setCurrentActive] = useState<string>(
        props.initialActive || (Array.isArray(props.elements) && props.elements.length > 0 && props.elements[0])
    );

    const setRef = useCallback((selectedRef: HTMLElement) => ref.current = selectedRef, [ref]);

    const getElement = useCallback((id?: string): HTMLElement => {
        return ref.current?.querySelector(`[data-spy=${id}]`);
    }, [ref]);

    const scrollToElement = useCallback((item?: string) => {
        const selected = props.elements && item && props.elements.includes(item) ? props.elements.find(element => element === item) : null;
        const element = selected ? getElement(selected) : null;
        if (element) element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        else ref.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, [ref]);

    useEffect(() => {
        if (!ref || !props.elements || !Array.isArray(props.elements) || props.elements.length === 0) return;
        setObservedNodes(props.elements.map(getElement));
    }, [ref]);

    useEffect(() => {
        if (observedNodes.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            const intersectingElement = entries.find(entry => entry.isIntersecting);
            setCurrentActive((intersectingElement?.target as HTMLElement)?.dataset?.spy);
        }, {
            ...props.options,
            root: props?.options?.root || document.querySelector('body')
        });

        observedNodes.forEach(element => element ? observer.observe(element) : null);

        return () => observer.disconnect();
    }, [observedNodes]);

    return {
        scrollToElement,
        currentActive,
        setRef,
    };
};

interface IScrollSpyComponentProps extends IScrollSpyProps, IHasChildren {}

export function ScrollSpy({ elements, children } : IScrollSpyComponentProps) {
    const { currentActive, scrollToElement, setRef } = useScrollSpy({ elements });
    return children({ scrollToElement, currentActive, setRef });
};