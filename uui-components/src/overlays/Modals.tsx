import * as React from 'react';
import { UuiContext } from '@epam/uui-core';
import { useContext, useEffect, useState } from 'react';

export function Modals() {
    const context = useContext(UuiContext);
    const [, setCount] = useState(0);

    useEffect(() => {
        if (!context) return;

        context.uuiModals.subscribe(() => {
            setCount((state) => state + 1);
        });
    }, [context]);

    return (
        <>
            {context.uuiModals.getOperations().map((modalOperation) => {
                return React.createElement(modalOperation.component, modalOperation.props);
            })}
        </>
    );
}
