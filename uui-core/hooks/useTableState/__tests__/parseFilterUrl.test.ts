import { parseUrlParam } from "../helpers";
import { setMockedUrl } from "./utils";

describe("parseFilterUrl", () => {
    it("should return undefined", () => {
        expect(parseUrlParam("filter")).toBe(undefined);

        setMockedUrl(null);
        expect(parseUrlParam("filter")).toBe(undefined);

        setMockedUrl("null");
        expect(parseUrlParam("filter")).toBe(undefined);

        setMockedUrl(undefined);
        expect(parseUrlParam("filter")).toBe(undefined);

        setMockedUrl("undefined");
        expect(parseUrlParam("filter")).toBe(undefined);
    });

    it("should parse filter value", () => {
        setMockedUrl(encodeURIComponent(JSON.stringify({ name: "test" })));
        expect(parseUrlParam("filter")).toEqual({ name: "test" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ ids: [1, 2, 3] })));
        expect(parseUrlParam("filter")).toEqual({ ids: [1, 2, 3] });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: "01.02.2003", to: "04.05.2006" })));
        expect(parseUrlParam("filter")).toEqual({ from: "01.02.2003", to: "04.05.2006" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: null, to: "04.05.2006" })));
        expect(parseUrlParam("filter")).toEqual({ from: null, to: "04.05.2006" });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: "01.02.2003", to: null })));
        expect(parseUrlParam("filter")).toEqual({ from: "01.02.2003", to: null });

        setMockedUrl(encodeURIComponent(JSON.stringify({ from: null, to: null })));
        expect(parseUrlParam("filter")).toEqual({ from: null, to: null });
    });
});