import clone from 'lodash.clone';
import { BaseContext } from './BaseContext';
import { LayoutContext } from './LayoutContext';
import * as React from 'react';
import { IModal } from '../types/props';
import { IModalContext } from '../types/contexts';

export interface ModalComponentProps<TParameters, TResult> {
    parameters?: TParameters;
    isActive: boolean;
    depth: number;
    zIndex: number;
    key: string;
    success(result: TResult): void;
    abort(result?: any): void;
}

export interface ModalOperation {
    component?: React.ComponentType<any>;
    props: ModalComponentProps<any, any>;
}

let idCounter = 0;

export class ModalOperationCancelled {}

export class ModalContext extends BaseContext implements IModalContext {
    private operations: ModalOperation[] = [];
    constructor(private layoutCtx: LayoutContext) {
        super();
    }

    public show<TResult, TParameters = {}>(render: (props: IModal<TResult>) => React.ReactElement<any>, parameters?: TParameters): Promise<TResult> {
        const ModalAdapter = class extends React.Component<ModalComponentProps<{}, TResult>> {
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

    private showModal<TParameters, TResult>(component: React.ComponentType<ModalComponentProps<TParameters, TResult>>, parameters?: TParameters): Promise<TResult> {
        const layer = this.layoutCtx.getLayer();
        return new Promise((resolve, reject) => {
            const modalProps: ModalComponentProps<TParameters, TResult> = {
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
        return this.operations.map((op, n) => {
            op = clone(op);
            op.props.isActive = n == this.operations.length - 1;
            return op;
        });
    }
}
