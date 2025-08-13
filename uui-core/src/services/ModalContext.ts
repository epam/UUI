import { BaseContext } from './BaseContext';
import { LayoutContext } from './LayoutContext';
import * as React from 'react';
import { IModalContext } from '../types/contexts';
import { IModal } from '../types/props';

export interface ModalOperation {
    /** Modal component that should be rendered */
    component?: React.ComponentType<any>;
    /** Modal component props */
    props: IModal<any>;
}

let idCounter = 0;

export class ModalOperationCancelled {}

export class ModalContext extends BaseContext implements IModalContext {
    private operations: ModalOperation[] = [];
    constructor(private layoutCtx: LayoutContext) {
        super();
    }

    public destroyContext() {
        super.destroyContext();
        this.closeAll();
    }

    public show<TResult, TParameters = {}>(render: (props: IModal<TResult, TParameters>) => React.ReactElement<any>, parameters?: TParameters): Promise<TResult> {
        return this.showModal(render, parameters);
    }

    public closeAll() {
        this.operations = [];
        this.update({});
    }

    public useModalIsActive(modalKey: string): boolean {
        const [isActive, setIsActive] = React.useState(false);

        React.useEffect(() => {
            const updateIsActive = () => {
                const operation = this.operations.find((op) => op.props.key === modalKey);
                if (operation) {
                    const index = this.operations.indexOf(operation);
                    const newIsActive = index === this.operations.length - 1;
                    setIsActive(newIsActive);
                }
            };

            // Initial state
            updateIsActive();

            // Subscribe to updates
            const unsubscribe = this.subscribe(updateIsActive);
            return unsubscribe;
        }, [modalKey]);

        return isActive;
    }

    private showModal<TParameters, TResult>(
        component: React.ComponentType<IModal<TResult, TParameters>> | ((props: IModal<TResult, TParameters>) => React.ReactElement<any>),
        parameters?: TParameters,
    ): Promise<TResult> {
        const layer = this.layoutCtx.getLayer();
        return new Promise((resolve, reject) => {
            const modalProps: IModal<TResult, TParameters> = {
                success: (r) => {
                    this.operations.pop();
                    this.layoutCtx.releaseLayer(layer);
                    resolve(r);
                    this.update({});
                },
                abort: (r) => {
                    this.operations.pop();
                    this.layoutCtx.releaseLayer(layer);
                    reject(r ? r : new ModalOperationCancelled());
                    this.update({});
                },
                zIndex: layer.zIndex,
                depth: layer.depth,
                key: idCounter++ + '',
                parameters,
            };

            let operation: ModalOperation;

            if (typeof component === 'function' && !React.isValidElement(component)) {
                // If component is a render function, create a wrapper component
                const modalKey = modalProps.key; // Capture key in closure
                const modalPropsWithKey = { ...modalProps, modalKey }; // Add modalKey to modalProps
                const WrapperComponent = class extends React.Component<IModal<TResult, TParameters>> {
                    render() {
                        return (component as (props: IModal<TResult, TParameters>) => React.ReactElement<any>)(this.props);
                    }
                };
                operation = { component: WrapperComponent, props: modalPropsWithKey };
            } else {
                // For component classes, ensure modalKey is available for backward compatibility
                const modalPropsWithKey = { ...modalProps, modalKey: modalProps.key };
                operation = { component: component as React.ComponentType<IModal<TResult, TParameters>>, props: modalPropsWithKey };
            }

            this.operations.push(operation);
            this.update({});
        });
    }

    public isModalOperationActive() {
        return this.operations.length > 0;
    }

    public getOperations(): ModalOperation[] {
        return this.operations;
    }
}
