import React from "react";
import renderer from "react-test-renderer";
import { getDefaultColumnsConfig } from "@epam/uui-core";
import { demoColumns } from "./dataMocks";
import {ColumnsConfigurationModal} from "../columnsConfigurationModal/ColumnsConfigurationModal";

describe("ColumnsConfigurationModal", () => {
    it("should be rendered correctly", () => {
        const modalProps = {
            zIndex: 1,
            key: 'test',
            abort: jest.fn(),
            success: jest.fn(),
            isActive: true,
        };
        const columnsConfig = getDefaultColumnsConfig(demoColumns);
        const tree = renderer
            .create(<ColumnsConfigurationModal
                modalProps={ modalProps }
                columns={ demoColumns }
                columnsConfig={ columnsConfig }
                defaultConfig={ columnsConfig }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


