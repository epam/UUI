import React from "react";
import renderer from "react-test-renderer";
import {getDefaultColumnsConfig, testData} from "@epam/uui";
import {ColumnsConfigurationModal} from "../ColumnsConfigurationModal";

describe("ColumnsConfigurationModal", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<ColumnsConfigurationModal
                key='test'
                zIndex={ 1 }
                abort={ jest.fn() }
                success={ jest.fn() }
                columns={ testData.dataColumns }
                columnsConfig={ getDefaultColumnsConfig(testData.dataColumns) }
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


