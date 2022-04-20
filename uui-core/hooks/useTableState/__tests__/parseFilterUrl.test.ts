import { parseFilterUrl } from "../helpers";
import { setMockedUrl } from "./utils";

describe("parseFilterUrl", () => {
    it("should return undefined", () => {
        expect(parseFilterUrl()).toBe(undefined);

        setMockedUrl(null);
        expect(parseFilterUrl()).toBe(undefined);

        setMockedUrl("null");
        expect(parseFilterUrl()).toBe(undefined);

        setMockedUrl(undefined);
        expect(parseFilterUrl()).toBe(undefined);

        setMockedUrl("undefined");
        expect(parseFilterUrl()).toBe(undefined);
    });

    it("should parse filter value", () => {
        setMockedUrl(encodeURIComponent(JSON.stringify({ name: "test" })));
        expect(parseFilterUrl()).toEqual({ name: "test" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ ids: [1, 2, 3] })));
        expect(parseFilterUrl()).toEqual({ ids: [1, 2, 3] });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: "01.02.2003", to: "04.05.2006" })));
        expect(parseFilterUrl()).toEqual({ from: "01.02.2003", to: "04.05.2006" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: null, to: "04.05.2006" })));
        expect(parseFilterUrl()).toEqual({ from: null, to: "04.05.2006" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: "01.02.2003", to: null })));
        expect(parseFilterUrl()).toEqual({ from: "01.02.2003", to: null });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: null, to: null })));
        expect(parseFilterUrl()).toEqual({ from: null, to: null });
    });
});