import React from "react";
import renderer from "react-test-renderer";
import {ClearNotification, ErrorNotification, HintNotification, NotificationCard, SuccessNotification, WarningNotification} from "../NotificationCard";
import * as acceptIcon from "../../icons/accept-12.svg";

jest.spyOn(NotificationCard.prototype, "refNode")
    .mockImplementation(function (this: typeof NotificationCard.prototype) {
        this.notificationCardNode = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        } as any;
    });

describe("NotificationCard", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<NotificationCard
                icon={ acceptIcon }
                id={ 1 }
                key='test'
                color='sun'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with icon", () => {
        const tree = renderer
            .create(<NotificationCard
                icon={ acceptIcon }
                id={ 1 }
                key='test'
                color='sun'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("WarningNotification", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<WarningNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("SuccessNotification", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<SuccessNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("HintNotification", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<HintNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ErrorNotification", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ErrorNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn() }
                onSuccess={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ClearNotification", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ClearNotification key='test'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});