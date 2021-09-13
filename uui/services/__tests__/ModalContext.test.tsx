import React from "react";
import { ModalContext } from "../ModalContext";
import { LayoutContext } from "../LayoutContext";

describe("ModalContext", () => {
    it("should create operations", () => {
        const context = new ModalContext(new LayoutContext());

        const render = () => <div/>;

        context.show(render);
        expect(context.getOperations().length).toBe(1);

        context.show(render);
        expect(context.getOperations().length).toBe(2);
    });
});