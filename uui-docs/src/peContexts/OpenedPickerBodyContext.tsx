import * as React from 'react';
import { DemoComponentProps } from '../types';
import { DefaultContext } from './DefaultContext';
import { useEffect, useMemo } from 'react';

OpenedPickerBodyContext.displayName = 'OpenedPickerBody';
export function OpenedPickerBodyContext(props: DemoComponentProps) {
    const { DemoComponent, isPreview } = props;
    const ref = React.useRef<any>(undefined);
    const adjustedProps = useMemo(() => ({
        ...props.props,
        ref: ref,
    }), [props, ref]);

    useEffect(() => {
        if (ref.current) {
            ref.current.openPickerBody();
        }
    }, []);

    return (
        <DefaultContext DemoComponent={ DemoComponent } isPreview={ isPreview } props={ adjustedProps } />
    );
}
