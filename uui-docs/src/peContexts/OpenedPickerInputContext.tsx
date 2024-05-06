import * as React from 'react';
import { DemoComponentProps } from '../types';
import { DefaultContext } from './DefaultContext';
import { useEffect, useMemo } from 'react';

OpenedPickerInputContext.displayName = 'OpenedPickerInput';
export function OpenedPickerInputContext(props: DemoComponentProps) {
    const { DemoComponent, isPreview } = props;
    const _pickerInputRef = React.useRef<any>();
    const adjustedProps = useMemo(() => ({
        ...props.props,
        ref: _pickerInputRef,
    }), [props, _pickerInputRef]);

    useEffect(() => {
        if (_pickerInputRef.current) {
            _pickerInputRef.current.openPickerBody();
        }
    }, []);

    return (
        <DefaultContext DemoComponent={ DemoComponent } isPreview={ isPreview } props={ adjustedProps } />
    );
}
