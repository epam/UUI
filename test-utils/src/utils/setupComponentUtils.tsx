import * as React from 'react';
import { useImperativeHandle, useState } from 'react';
import { renderToJsdomWithContextAsync, type CustomWrapperType } from './renderingWithContextUtils';
import { act } from '@testing-library/react';

type PropsContextType<TProps> = { setProperty: (name: keyof TProps, value: TProps[keyof TProps]) => void; };
export type PropsInitializerCallbackType<TProps> = (contextRef: React.RefObject<PropsContextType<TProps>>) => PropsAll<TProps>;
export type ComponentRenderCallbackType<TProps> = (props: PropsAll<TProps>) => React.ReactElement;

type PropsAll<TProps> = { [key in keyof TProps]: TProps[key] };
type PropsSubset<TProps> = { [key in keyof TProps]?: TProps[key] };
type PropsSubsetMock<TProps> = { [key in keyof TProps]?: jest.Mock };

type SetupComponentForTestReturnType<TProps> = Promise<{
    result: Awaited<ReturnType<typeof renderToJsdomWithContextAsync>>,
    setProps: (propsToUpdate: PropsSubset<TProps>) => void,
    mocks: PropsSubsetMock<TProps>,
}>;

/**
 * Renders the component to JSDom
 *
 * Useful if one of the features below is needed:
 * - on-change workflow, when a callback prop (e.g. "onValueChange") updates some other props (e.g. "value").
 * - ability to update props without unmounting the component.
 *
 * @param propsInitializer
 * @param componentRenderer
 */
export async function setupComponentForTest<TProps extends PropsAll<TProps>>(
    propsInitializer: PropsInitializerCallbackType<TProps>,
    componentRenderer: ComponentRenderCallbackType<TProps>,
    customWrapper?: CustomWrapperType,
): SetupComponentForTestReturnType<TProps> {
    const propsContextRef = React.createRef<PropsContextType<TProps>>();
    const propsConfig = propsInitializer(propsContextRef);
    const mocks: PropsSubsetMock<TProps> = {};

    Object.keys(propsConfig).forEach((name) => {
        const value = propsConfig[name as keyof TProps];
        if (jest.isMockFunction(value)) {
            // this is jest mock function
            mocks[name as keyof TProps] = value as jest.Mock;
        }
    });

    function TestComponent({ compRef }: { compRef: React.Ref<PropsContextType<TProps>> }) {
        const [allProps, setAllProps] = useState(() => {
            return { ...propsConfig };
        });
        useImperativeHandle(compRef, () => {
            return {
                setProperty: (name: keyof TProps, value: TProps[keyof TProps]) => {
                    setAllProps((prevProps) => {
                        return {
                            ...prevProps,
                            [name]: value,
                        };
                    });
                },
            };
        }, []);
        return componentRenderer(allProps);
    }
    const result = await renderToJsdomWithContextAsync(<TestComponent compRef={ propsContextRef } />, customWrapper);

    return {
        result,
        setProps: (propsToUpdate: PropsSubset<TProps>) => {
            const propsToUpdateNames = Object.keys(propsToUpdate);
            act(() => {
                propsToUpdateNames.forEach((name) => {
                    propsContextRef.current.setProperty(name as keyof TProps, propsToUpdate[name as keyof TProps]);
                });
            });
        },
        mocks,
    };
}
