import React from 'react';
import { ModalContext, ModalOperationCancelled } from '../ModalContext';
import { LayoutContext } from '../LayoutContext';

describe('ModalContext', () => {
    let context: ModalContext;

    beforeEach(() => {
        context = new ModalContext(new LayoutContext());
    });

    it('should create operations', () => {
        expect(context.isModalOperationActive()).toBe(false);

        const render = () => <div />;

        context.show(render);
        expect(context.getOperations().length).toBe(1);
        expect(context.isModalOperationActive()).toBe(true);

        context.show(render);
        expect(context.getOperations().length).toBe(2);
    });

    it('should handle success', (done) => {
        const data = 'test';
        context
            .show(() => <div />)
            .then((result) => {
                expect(result).toBe(data);
                expect(context.getOperations().length).toBe(0);
                done();
            });
        expect(context.getOperations().length).toBe(1);

        context.getOperations()[0].props.success(data);
    });

    it('should handle abort', async () => {
        const p = context.show(() => <div />);
        expect(context.getOperations().length).toBe(1);
        context.getOperations()[0].props.abort();
        await p.catch(() => {
            // ignore for test
        });
        expect(context.getOperations().length).toBe(0);
    });

    it('should reject with ModalOperationCancelled when abort is called without argument', async () => {
        const p = context.show(() => <div />);
        expect(context.getOperations().length).toBe(1);
        context.getOperations()[0].props.abort();

        await expect(p).rejects.toBeInstanceOf(ModalOperationCancelled);
        expect(context.getOperations().length).toBe(0);
    });

    it('should reject with provided value when abort is called with argument', async () => {
        const error = new Error('Custom abort error');
        const p = context.show(() => <div />);
        expect(context.getOperations().length).toBe(1);
        context.getOperations()[0].props.abort(error);

        await expect(p).rejects.toBe(error);
        expect(context.getOperations().length).toBe(0);
    });

    it('should have correct arguments', () => {
        context = new ModalContext(new LayoutContext());

        const testParameters = { name: 'test', onClick: jest.fn() };
        context.show(() => <div />, testParameters);

        let operation = context.getOperations()[0];
        expect(operation.props.parameters).toBe(testParameters);
        expect(operation.props.isActive).toBe(true);
        const key = operation.props.key;
        const depth = operation.props.depth;
        const zIndex = operation.props.zIndex;

        context.show(() => <div />);
        operation = context.getOperations()[1];
        expect(operation.props.key).toBe((parseInt(key) + 1).toString());
        expect(operation.props.depth).toBe(depth + 1);
        expect(operation.props.zIndex).toBe(zIndex + 100);
    });

    it('should close all', () => {
        const render = () => <div />;

        context.show(render);
        context.show(render);
        expect(context.getOperations().length).toBe(2);

        context.closeAll();
        expect(context.getOperations().length).toBe(0);
        expect(context.isModalOperationActive()).toBe(false);
    });

    it('should destroy context and close all operations', () => {
        const render = () => <div />;
        const handler = jest.fn();

        context.show(render);
        context.show(render);
        expect(context.getOperations().length).toBe(2);

        context.subscribe(handler);
        expect(handler).toHaveBeenCalledTimes(0);

        context.destroyContext();
        expect(context.getOperations().length).toBe(0);
        expect(context.isModalOperationActive()).toBe(false);

        // Verify that handlers are cleared (BaseContext behavior)
        context.update({});
        expect(handler).toHaveBeenCalledTimes(0);
    });

    it('should create ModalAdapter component that wraps render function', () => {
        const render = jest.fn(() => <div data-testid="modal" />);
        const testParameters = { name: 'test' };

        context.show(render, testParameters);
        expect(context.getOperations().length).toBe(1);

        const operation = context.getOperations()[0];
        expect(operation.component).toBeDefined();
        expect(typeof operation.component).toBe('function');

        // Verify that ModalAdapter is a React component class
        const ModalAdapter = operation.component!;
        expect(ModalAdapter.prototype).toBeDefined();
        expect(ModalAdapter.prototype.render).toBeDefined();
    });

    it('should pass parameters through show method', () => {
        const render = jest.fn(() => <div />);
        const testParameters = { userId: 123, action: 'delete' };

        context.show(render, testParameters);
        expect(context.getOperations().length).toBe(1);

        const operation = context.getOperations()[0];
        expect(operation.props.parameters).toBe(testParameters);
    });

    it('should return a promise from show method', () => {
        const render = () => <div />;
        const promise = context.show(render);

        expect(promise).toBeInstanceOf(Promise);
        expect(context.getOperations().length).toBe(1);
    });
});
