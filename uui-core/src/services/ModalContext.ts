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
        const ModalAdapter = class extends React.Component<IModal<TResult, TParameters>> {
            render() {
                return render(this.props);
            }
        };

        return this.showModal(ModalAdapter, parameters);
    }

    public closeAll() {
        this.operations = [];
        this.update({});
    }

    private showModal<TParameters, TResult>(component: React.ComponentType<IModal<TResult, TParameters>>, parameters?: TParameters): Promise<TResult> {
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
                isActive: true,
                key: idCounter++ + '',
                parameters,
            };

            const operation: ModalOperation = { component, props: modalProps };

            this.operations.push(operation);

            this.update({});
        });
    }

    public isModalOperationActive() {
        return this.operations.length > 0;
    }

    public getOperations(): ModalOperation[] {
        return this.operations.map((op, n) => ({
            ...op, props: { ...op.props, isActive: n === this.operations.length - 1 },
        }));
    }
}
