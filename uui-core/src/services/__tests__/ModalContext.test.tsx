import React from 'react';
import { ModalContext } from '../ModalContext';
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

    it('should handle success', done => {
        const data = 'test';
        context
            .show(() => <div />)
            .then(result => {
                expect(result).toBe(data);
                expect(context.getOperations().length).toBe(0);
                done();
            });
        expect(context.getOperations().length).toBe(1);

        context.getOperations()[0].props.success(data);
    });

    it('should handle abort', done => {
        context
            .show(() => <div />)
            .catch(() => {
                expect(context.getOperations().length).toBe(0);
                done();
            });
        expect(context.getOperations().length).toBe(1);

        context.getOperations()[0].props.abort();
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
        expect(operation.props.key).toBe((parseInt(key, 10) + 1).toString());
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
});
