import React from "react";
import { ModalContext } from "../ModalContext";
import { LayoutContext } from "../LayoutContext";
import { delay } from "@epam/test-utils";
import { shallow } from "enzyme";
import { IModal } from "../../types";
import { ModalBlocker } from "@epam/promo";

describe("ModalContext", () => {
    it("should ", async () => {
        jest.useRealTimers();
        const layout = new LayoutContext();
        const context = new ModalContext(layout);
        
        // const render = () => <div id="test"/>;

        // const Modal: React.FC = () => {
        //     return context.getOperations().map((modalOperation: any) => {
        //         return React.createElement(modalOperation.component, modalOperation.props);
        //     });
        // };

        context.show(modalProps => (
            <ModalBlocker blockerShadow='dark' { ...modalProps }>
                <div id="test"/>
            </ModalBlocker>
        )); 
        
        //.then(() => {

        // const Modal: React.FC = () => {
        //     return getOperations();
        // };

        await delay(10);
        
        expect(document.querySelector("#test")).toBeTruthy();
        //done();
        // });

    });
});