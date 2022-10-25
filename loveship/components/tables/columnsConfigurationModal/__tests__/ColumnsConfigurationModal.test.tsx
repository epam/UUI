import React from "react";
import { getDefaultColumnsConfig } from "@epam/uui-core";
import { demoColumns } from "../../__tests__/dataMocks";
import {ColumnsConfigurationModal} from "../ColumnsConfigurationModal";
import { renderWithContextAsync } from '@epam/test-utils';

describe("ColumnsConfigurationModal", () => {
    it("should be rendered correctly", async () => {
        const modalProps = {
            zIndex: 1,
            key: 'test',
            abort: jest.fn(),
            success: jest.fn(),
            isActive: true,
        };
        const columnsConfig = getDefaultColumnsConfig(demoColumns);
        const tree = await renderWithContextAsync(<ColumnsConfigurationModal
                modalProps={ modalProps }
                columns={ demoColumns }
                columnsConfig={ columnsConfig }
                defaultConfig={ columnsConfig }
            />);
        expect(tree).toMatchSnapshot();
    });
});


