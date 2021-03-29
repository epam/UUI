import React from "react";
import renderer from "react-test-renderer";
import { getDefaultColumnsConfig } from "@epam/uui";
import { demoColumns } from "./dataMocks";
import {ColumnsConfigurationModal} from "../ColumnsConfigurationModal";

describe("ColumnsConfigurationModal", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ColumnsConfigurationModal
                key='test'
                zIndex={ 1 }
                abort={ jest.fn() }
                success={ jest.fn() }
                columns={ demoColumns }
                columnsConfig={ getDefaultColumnsConfig(demoColumns) }
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


